import {
    ForbiddenException,
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, asc, inArray } from 'drizzle-orm';
import * as schema from '../../db/schema';
import { buildFirstRound } from './bracket.util';
import { QuestionsService } from 'src/modules/questions/questions.service';

const COUNTDOWN_MS = 3000;
const DUEL_COUNTDOWN_MS = 3000;

@Injectable()
export class ShowdownService {
    constructor(@Inject('DB') private db: NodePgDatabase<typeof schema>,
        private readonly questionsService: QuestionsService,
    ) { }

    // ── Tournament setup phase ──────────────────────────────────────────

    async create(instructorArenaUserId: string, dto: {
        courseId: string; title: string;
        questionsPerMatch?: number; timeLimitSeconds?: number; scheduledAt?: string;
    }) {
        const [showdown] = await this.db.insert(schema.showdowns).values({
            courseId: dto.courseId,
            createdBy: instructorArenaUserId,
            title: dto.title,
            mode: 'tournament',
            questionsPerMatch: dto.questionsPerMatch ?? 3,
            timeLimitSeconds: dto.timeLimitSeconds ?? 20,
            matchCountdownMs: COUNTDOWN_MS,
            scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        }).returning();
        return showdown;
    }
    async openLobby(showdownId: string, requesterArenaUserId: string) {
        const showdown = await this.assertOwner(showdownId, requesterArenaUserId);
        if (showdown.status !== 'draft') return showdown;

        const [updated] = await this.db.update(schema.showdowns)
            .set({ status: 'lobby' })
            .where(eq(schema.showdowns.id, showdownId))
            .returning();
        return updated;
    }

    /** Instructor picks who's competing; builds round 0 and locks seeding. */
    async buildBracket(
        showdownId: string,
        requesterArenaUserId: string,
        arenaUserIds: string[],
    ) {
        const showdown = await this.assertOwner(showdownId, requesterArenaUserId);
        if (showdown.status !== 'lobby') {
            throw new BadRequestException('Showdown is not in lobby state.');
        }

        return this.db.transaction(async (tx) => {
            await tx.insert(schema.showdownParticipants)
                .values(arenaUserIds.map((arenaUserId) => ({ showdownId, arenaUserId })));

            const withNames = await tx.query.showdownParticipants.findMany({
                where: (p, { eq }) => eq(p.showdownId, showdownId),
                with: { arenaUser: { with: { user: true } } },
            });

            const seedPlayers = withNames.map((p) => ({
                participantId: p.id,
                name: p.arenaUser.user.username,
            }));

            const { matches, totalRounds } = buildFirstRound(seedPlayers);

            await tx.insert(schema.showdownMatches).values(
                matches.map((m) => ({
                    showdownId,
                    round: m.round,
                    matchIndex: m.matchIndex,
                    playerAId: m.playerAId,
                    playerBId: m.playerBId,
                    // A bye auto-wins immediately — no live question needed
                    winnerId: m.playerBId === null ? m.playerAId : null,
                    status: m.playerBId === null ? ('complete' as const) : ('pending' as const),
                })),
            );

            const [updated] = await tx.update(schema.showdowns)
                .set({ status: 'seeding', totalRounds })
                .where(eq(schema.showdowns.id, showdownId))
                .returning();

            return updated;
        });
    }

    // ── Tournament live phase (instructor/admin controlled) ─────────────

    async startMatch(
        showdownId: string,
        matchId: string,
        requesterArenaUserId: string,
    ) {
        const showdown = await this.assertOwner(showdownId, requesterArenaUserId);
        const match = await this.getMatchOrThrow(matchId, showdownId);
        if (match.playerBId === null) {
            throw new BadRequestException('Match is a bye — nothing to start.');
        }

        const question = await this.pickUnusedQuestionFor(showdownId);
        if (!question) throw new BadRequestException('Question bank exhausted.');

        const startedAt = new Date(Date.now() + showdown.matchCountdownMs);
        const endsAt = new Date(startedAt.getTime() + showdown.timeLimitSeconds * 1000);

        return this.db.transaction(async (tx) => {
            await tx.insert(schema.showdownMatchQuestions).values({
                matchId,
                questionId: question.id,
                questionNumber: match.questionsCompleted + 1,
                timeLimitSeconds: showdown.timeLimitSeconds,
                startedAt,
                endsAt,
            });

            await tx.update(schema.showdownMatches)
                .set({ status: 'active', startedAt: match.startedAt ?? new Date() })
                .where(eq(schema.showdownMatches.id, matchId));

            if (showdown.status !== 'live') {
                await tx.update(schema.showdowns)
                    .set({ status: 'live' })
                    .where(eq(schema.showdowns.id, showdownId));
            }
        });
    }

    async resolveQuestion(
        showdownId: string,
        matchId: string,
        requesterArenaUserId: string,
    ) {
        const showdown = await this.assertOwner(showdownId, requesterArenaUserId);
        const match = await this.getMatchOrThrow(matchId, showdownId);

        // Already fully resolved (e.g. a duplicate call arrived after the match
        // was already completed) — treat as a harmless no-op, not an error.
        if (match.status === 'complete') {
            return match;
        }

        const currentMq = await this.db.query.showdownMatchQuestions.findFirst({
            where: (q, { eq, and }) => and(
                eq(q.matchId, matchId),
                eq(q.questionNumber, match.questionsCompleted + 1),
            ),
        });

        if (!currentMq) {
            // No question at questionsCompleted+1 — check whether this is actually
            // a duplicate resolve of the question we JUST scored (questionsCompleted
            // itself), which happens when a fast double-click or a network retry
            // sends the same resolve twice. If so, this is a no-op, not a real error.
            const justResolved = match.questionsCompleted > 0
                ? await this.db.query.showdownMatchQuestions.findFirst({
                    where: (q, { eq, and }) => and(
                        eq(q.matchId, matchId),
                        eq(q.questionNumber, match.questionsCompleted),
                    ),
                })
                : null;

            if (justResolved) {
                return match; // duplicate resolve — silently succeed
            }

            throw new BadRequestException('No active question for this match.');
        }

        const isLastQuestion = match.questionsCompleted + 1 >= showdown.questionsPerMatch;

        return this.db.transaction(async (tx) => {
            const updatedMatch = await tx.update(schema.showdownMatches)
                .set({ questionsCompleted: match.questionsCompleted + 1 })
                .where(eq(schema.showdownMatches.id, matchId))
                .returning();

            if (isLastQuestion) {
                const scores = await this.computeMatchScores(matchId);
                const aScore = scores[match.playerAId] ?? 0;
                const bScore = match.playerBId ? (scores[match.playerBId] ?? 0) : 0;
                const winnerId = aScore >= bScore ? match.playerAId : match.playerBId!;

                await tx.update(schema.showdownMatches)
                    .set({ winnerId, status: 'complete', completedAt: new Date() })
                    .where(eq(schema.showdownMatches.id, matchId));
            }

            return updatedMatch[0];
        });
    }

    async nextQuestion(
        showdownId: string,
        matchId: string,
        requesterArenaUserId: string,
    ) {
        const showdown = await this.assertOwner(showdownId, requesterArenaUserId);
        const match = await this.getMatchOrThrow(matchId, showdownId);
        if (match.questionsCompleted >= showdown.questionsPerMatch) {
            throw new BadRequestException('Match already complete.');
        }

        const question = await this.pickUnusedQuestionFor(showdownId);
        if (!question) throw new BadRequestException('Question bank exhausted.');

        const startedAt = new Date(Date.now() + showdown.matchCountdownMs);
        const endsAt = new Date(startedAt.getTime() + showdown.timeLimitSeconds * 1000);

        await this.db.insert(schema.showdownMatchQuestions).values({
            matchId,
            questionId: question.id,
            questionNumber: match.questionsCompleted + 1,
            timeLimitSeconds: showdown.timeLimitSeconds,
            startedAt,
            endsAt,
        });
    }

    /** After every match in the current round is decided: build next round or crown champion. */
    async advance(showdownId: string, requesterArenaUserId: string) {
        const showdown = await this.assertOwner(showdownId, requesterArenaUserId);
        const matches = await this.db.query.showdownMatches.findMany({
            where: (m, { eq }) => eq(m.showdownId, showdownId),
        });

        const maxRound = Math.max(...matches.map((m) => m.round));
        const currentRound = matches.filter((m) => m.round === maxRound);

        if (!currentRound.every((m) => m.winnerId)) {
            throw new BadRequestException('Current round is not finished.');
        }

        if (currentRound.length === 1) {
            const [updated] = await this.db.update(schema.showdowns)
                .set({ status: 'complete', championId: currentRound[0].winnerId })
                .where(eq(schema.showdowns.id, showdownId))
                .returning();
            return updated;
        }

        const winnerIds = currentRound.map((m) => m.winnerId!);

        type NewMatch = typeof schema.showdownMatches.$inferInsert;
        const nextRoundMatches: NewMatch[] = [];

        for (let i = 0; i < winnerIds.length; i += 2) {
            const hasOpponent = winnerIds[i + 1] !== undefined;
            nextRoundMatches.push({
                showdownId,
                round: maxRound + 1,
                matchIndex: nextRoundMatches.length,
                playerAId: winnerIds[i],
                playerBId: hasOpponent ? winnerIds[i + 1] : null,
                winnerId: hasOpponent ? null : winnerIds[i],
                status: hasOpponent ? 'pending' : 'complete',
            });
        }

        await this.db.insert(schema.showdownMatches).values(nextRoundMatches);
        return showdown;
    }


    async listIncomingChallenges(arenaUserId: string) {
        const participations = await this.db.query.showdownParticipants.findMany({
            where: (p, { eq }) => eq(p.arenaUserId, arenaUserId),
            with: {
                showdown: {
                    with: {
                        participants: { with: { arenaUser: { with: { user: true } } } },
                    },
                },
            },
        });

        return participations
            .filter((p) => p.showdown.mode === 'duel' && p.showdown.status === 'challenge_pending')
            .filter((p) => p.showdown.createdBy !== arenaUserId)
            .map((p) => {
                const challenger = p.showdown.participants.find((x) => x.arenaUserId === p.showdown.createdBy);
                return {
                    showdownId: p.showdown.id,
                    courseId: p.showdown.courseId,
                    fromUsername: challenger?.arenaUser.user.username ?? '?',
                    createdAt: p.showdown.createdAt,
                };
            });
    }

    async listOutgoingChallenges(arenaUserId: string) {
        const rows = await this.db.query.showdowns.findMany({
            where: (s, { eq, and }) => and(
                eq(s.createdBy, arenaUserId),
                eq(s.mode, 'duel'),
                eq(s.status, 'challenge_pending'),
            ),
            with: {
                participants: { with: { arenaUser: { with: { user: true } } } },
            },
        });

        return rows.map((r) => ({
            showdownId: r.id,
            courseId: r.courseId,
            toUsername: r.participants.find((p) => p.arenaUserId !== arenaUserId)?.arenaUser.user.username ?? '?',
            createdAt: r.createdAt,
        }));
    }
    // ── Duel flow (peer-initiated, self-driving) ────────────────────────

    async createDuelChallenge(initiatorArenaUserId: string, dto: {
        courseId: string; opponentArenaUserId: string;
        questionsPerMatch?: number; timeLimitSeconds?: number;
    }) {
        if (initiatorArenaUserId === dto.opponentArenaUserId) {
            throw new BadRequestException('Cannot challenge yourself.');
        }

        return this.db.transaction(async (tx) => {
            const [showdown] = await tx.insert(schema.showdowns).values({
                courseId: dto.courseId,
                createdBy: initiatorArenaUserId,
                title: 'Peer Duel',
                mode: 'duel',
                status: 'challenge_pending',
                questionsPerMatch: dto.questionsPerMatch ?? 3,
                timeLimitSeconds: dto.timeLimitSeconds ?? 20,
                matchCountdownMs: DUEL_COUNTDOWN_MS,
                totalRounds: 1,
            }).returning();

            const participants = await tx.insert(schema.showdownParticipants).values([
                { showdownId: showdown.id, arenaUserId: initiatorArenaUserId },
                { showdownId: showdown.id, arenaUserId: dto.opponentArenaUserId },
            ]).returning();

            // Match created now but left pending — no question fires until accepted.
            await tx.insert(schema.showdownMatches).values({
                showdownId: showdown.id,
                round: 0,
                matchIndex: 0,
                playerAId: participants[0].id,
                playerBId: participants[1].id,
                status: 'pending',
            });

            return showdown;
        });
    }

    /** Only the challenged participant may accept. Moves to ready_check — does NOT start the match yet. */
    async acceptDuelChallenge(showdownId: string, requesterArenaUserId: string) {
        const showdown = await this.getShowdownOrThrow(showdownId);
        if (showdown.mode !== 'duel' || showdown.status !== 'challenge_pending') {
            throw new BadRequestException('This challenge is not awaiting a response.');
        }

        const participant = await this.db.query.showdownParticipants.findFirst({
            where: (p, { eq, and }) => and(eq(p.showdownId, showdownId), eq(p.arenaUserId, requesterArenaUserId)),
        });
        if (!participant || participant.arenaUserId === showdown.createdBy) {
            throw new ForbiddenException('Only the challenged opponent can accept.');
        }

        await this.db.update(schema.showdowns)
            .set({ status: 'ready_check' })
            .where(eq(schema.showdowns.id, showdownId));

        return this.getFullState(showdownId);
    }

    /** Called by the gateway once both duel participants are confirmed connected to the showdown room. Idempotent. */
    async activateReadyDuel(showdownId: string) {
        const showdown = await this.getShowdownOrThrow(showdownId);
        if (showdown.status !== 'ready_check') return; // already activated or in a different state — no-op

        await this.db.update(schema.showdowns)
            .set({ status: 'live' })
            .where(eq(schema.showdowns.id, showdownId));

        const match = await this.db.query.showdownMatches.findFirst({
            where: (m, { eq }) => eq(m.showdownId, showdownId),
        });
        if (!match) return;

        await this.startDuelQuestion(showdownId, match.id);
    }

    async declineDuelChallenge(showdownId: string, requesterArenaUserId: string) {
        const showdown = await this.getShowdownOrThrow(showdownId);
        if (showdown.mode !== 'duel' || showdown.status !== 'challenge_pending') {
            throw new BadRequestException('This challenge is not awaiting a response.');
        }
        const participant = await this.db.query.showdownParticipants.findFirst({
            where: (p, { eq, and }) => and(
                eq(p.showdownId, showdownId),
                eq(p.arenaUserId, requesterArenaUserId),
            ),
        });
        if (!participant) throw new ForbiddenException('Not a participant in this duel.');

        const [updated] = await this.db.update(schema.showdowns)
            .set({ status: 'complete' }) // no championId — declined, not played
            .where(eq(schema.showdowns.id, showdownId))
            .returning();
        return updated;
    }

    // ── Internal: server-driven progression, never exposed as a socket event ──
    // Called only by ShowdownGateway's own scheduler, never in response to a
    // client message. No requesterArenaUserId param — there is no requester.

    async startDuelQuestion(showdownId: string, matchId: string) {
        const showdown = await this.getShowdownOrThrow(showdownId);
        const match = await this.getMatchOrThrow(matchId, showdownId);
        if (match.questionsCompleted >= showdown.questionsPerMatch) return null;

        const question = await this.pickUnusedQuestionFor(showdownId);
        if (!question) {
            // Bank exhausted mid-duel — end it gracefully rather than hang forever.
            await this.finalizeDuel(showdownId, matchId);
            return null;
        }

        const startedAt = new Date(Date.now() + showdown.matchCountdownMs);
        const endsAt = new Date(startedAt.getTime() + showdown.timeLimitSeconds * 1000);

        const [mq] = await this.db.insert(schema.showdownMatchQuestions).values({
            matchId,
            questionId: question.id,
            questionNumber: match.questionsCompleted + 1,
            timeLimitSeconds: showdown.timeLimitSeconds,
            startedAt,
            endsAt,
        }).returning();

        if (match.status !== 'active') {
            await this.db.update(schema.showdownMatches)
                .set({ status: 'active', startedAt: match.startedAt ?? new Date() })
                .where(eq(schema.showdownMatches.id, matchId));
        }

        return mq; // gateway uses mq.endsAt to schedule the next timer tick
    }

    /** Fires when a duel question's timer expires — scores it and either starts the next one or ends the duel. */
    async autoResolveDuelQuestion(showdownId: string, matchId: string) {
        const match = await this.getMatchOrThrow(matchId, showdownId);
        const showdown = await this.getShowdownOrThrow(showdownId);

        // Idempotency guard: if this has already been resolved (e.g. gateway
        // restarted and rescheduled a duplicate timer), do nothing.
        const currentMq = await this.db.query.showdownMatchQuestions.findFirst({
            where: (q, { eq, and }) => and(
                eq(q.matchId, matchId),
                eq(q.questionNumber, match.questionsCompleted + 1),
            ),
        });
        if (!currentMq) return null;

        const isLastQuestion = match.questionsCompleted + 1 >= showdown.questionsPerMatch;

        await this.db.update(schema.showdownMatches)
            .set({ questionsCompleted: match.questionsCompleted + 1 })
            .where(eq(schema.showdownMatches.id, matchId));

        if (isLastQuestion) {
            await this.finalizeDuel(showdownId, matchId);
            return null;
        }

        return this.startDuelQuestion(showdownId, matchId);
    }

    private async finalizeDuel(showdownId: string, matchId: string) {
        const match = await this.getMatchOrThrow(matchId, showdownId);
        const scores = await this.computeMatchScores(matchId);
        const aScore = scores[match.playerAId] ?? 0;
        const bScore = match.playerBId ? (scores[match.playerBId] ?? 0) : 0;
        const winnerId = aScore >= bScore ? match.playerAId : match.playerBId!;

        await this.db.transaction(async (tx) => {
            await tx.update(schema.showdownMatches)
                .set({ winnerId, status: 'complete', completedAt: new Date() })
                .where(eq(schema.showdownMatches.id, matchId));
            await tx.update(schema.showdowns)
                .set({ status: 'complete', championId: winnerId })
                .where(eq(schema.showdowns.id, showdownId));
        });
    }


    async getFeed(courseId: string, viewerArenaUserId: string) {
        const recentCompleted = await this.db.query.showdowns.findMany({
            where: (s, { eq, and }) => and(eq(s.courseId, courseId), eq(s.status, 'complete')),
            orderBy: (s, { desc }) => [desc(s.updatedAt)],
            limit: 10,
            with: {
                participants: { with: { arenaUser: { with: { user: true } } } },
                matches: true,
            },
        });

        const battles = await Promise.all(
            recentCompleted
                .filter((s) => s.championId) // exclude declined duels (no championId)
                .map(async (s) => {
                    const lastMatch = s.matches[s.matches.length - 1];
                    const scores = lastMatch ? await this.computeMatchScores(lastMatch.id) : {};
                    const winner = s.participants.find((p) => p.id === s.championId);
                    const loser = s.participants.find((p) => p.id !== s.championId);
                    return {
                        id: s.id,
                        winner: {
                            name: winner?.arenaUser.user.username ?? '?',
                            score: winner ? scores[winner.id] ?? 0 : 0,
                        },
                        loser: {
                            name: loser?.arenaUser.user.username ?? '?',
                            score: loser ? scores[loser.id] ?? 0 : 0,
                        },
                        quizName: s.title,
                        createdAt: s.updatedAt,
                    };
                }),
        );

        const pending = await this.db.query.showdownParticipants.findMany({
            where: (p, { eq }) => eq(p.arenaUserId, viewerArenaUserId),
            with: { showdown: { with: { participants: { with: { arenaUser: { with: { user: true } } } } } } },
        });

        const challenges = pending
            .filter((p) => p.showdown.courseId === courseId)
            .filter((p) => p.showdown.mode === 'duel' && p.showdown.status === 'challenge_pending')
            .filter((p) => p.showdown.createdBy !== viewerArenaUserId)
            .map((p) => {
                const challenger = p.showdown.participants.find((x) => x.arenaUserId === p.showdown.createdBy);
                return {
                    id: p.showdown.id,
                    showdownId: p.showdown.id,
                    fromUsername: challenger?.arenaUser.user.username,
                    createdAt: p.showdown.createdAt,
                };
            });

        const liveDuels = pending
            .filter((p) => p.showdown.courseId === courseId)
            .filter((p) => (p.showdown.mode === 'duel' || p.showdown.mode === 'async_duel') && (p.showdown.status === 'live' || p.showdown.status === 'ready_check') && !p.completedAt)
            .map((p) => {
                const opponent = p.showdown.participants.find((x) => x.arenaUserId !== viewerArenaUserId);
                return {
                    id: p.showdown.id,
                    showdownId: p.showdown.id,
                    opponentName: opponent?.arenaUser.user.username ?? '?',
                    opponentAvatar: opponent?.arenaUser.user.username ?? '?',
                    mode: p.showdown.mode,
                    createdAt: p.showdown.createdAt,
                };
            });

        // ── Public activity — visible to ALL course members ──────────────────
        // Shows challenge_pending, ready_check, and live duels/async_duels
        // so the whole room can watch the action unfold.
        const activePublicDuels = await this.db.query.showdowns.findMany({
            where: (s, { eq: eqFn, and, inArray: inArr }) => and(
                eqFn(s.courseId, courseId),
                inArr(s.mode, ['duel', 'async_duel'] as any),
                inArr(s.status, ['challenge_pending', 'ready_check', 'live'] as any),
            ),
            with: {
                participants: { with: { arenaUser: { with: { user: true } } } },
            },
            orderBy: (s, { desc }) => [desc(s.createdAt)],
            limit: 20,
        });

        const publicActivity = activePublicDuels.map((s) => {
            const challenger = s.participants.find((p) => p.arenaUserId === s.createdBy);
            const opponent   = s.participants.find((p) => p.arenaUserId !== s.createdBy);
            const isLive     = s.status === 'live' || s.status === 'ready_check';
            return {
                id: s.id,
                showdownId: s.id,
                challengerName: challenger?.arenaUser.user.username ?? '?',
                opponentName:   opponent?.arenaUser.user.username ?? '?',
                status: s.status as string,
                mode:   s.mode as string,
                event:  isLive ? 'live' : 'challenged',
                createdAt: s.createdAt,
            };
        });

        return { battles, challenges, liveDuels, publicActivity };
    }

    // ── Read model for the gateway to broadcast ─────────────────────────

    async getFullState(showdownId: string) {
        const showdown = await this.getShowdownOrThrow(showdownId);

        const participants = await this.db.query.showdownParticipants.findMany({
            where: (p, { eq }) => eq(p.showdownId, showdownId),
            with: { arenaUser: { with: { user: true } } },
        });

        const matches = await this.db.query.showdownMatches.findMany({
            where: (m, { eq }) => eq(m.showdownId, showdownId),
            orderBy: [asc(schema.showdownMatches.round), asc(schema.showdownMatches.matchIndex)],
            with: { questions: { with: { question: true, answers: true } } },
        });

        const matchesWithScores = await Promise.all(
            matches.map(async (m) => ({
                ...m,
                scores: await this.computeMatchScores(m.id),
            })),
        );

        return { showdown, participants, matches: matchesWithScores };
    }

    async listTournamentsForCourse(courseId: string, statusFilter?: string) {
        const rows = await this.db.query.showdowns.findMany({
            where: (s, { eq, and }) => and(eq(s.courseId, courseId), eq(s.mode, 'tournament')),
            orderBy: (s, { desc }) => [desc(s.createdAt)],
            with: { participants: true, matches: true },
        });

        const mapped = rows.map((s) => {
            const maxRound = s.matches.length > 0 ? Math.max(...s.matches.map((m) => m.round)) : 0;
            const activeMatch = s.matches.find((m) => m.status === 'active');
            return {
                id: s.id,
                title: s.title,
                status: s.status,
                scheduledAt: s.scheduledAt,
                participantCount: s.participants.length,
                totalRounds: s.totalRounds,
                currentRound: s.matches.length > 0 ? maxRound + 1 : 0,
                hasActiveMatch: !!activeMatch,
                createdAt: s.createdAt,
                championId: s.championId,
            };
        });

        if (!statusFilter) return mapped;
        return mapped.filter((t) => t.status === statusFilter);
    }
    async cancelTournament(showdownId: string, requesterArenaUserId: string) {
        const showdown = await this.assertOwner(showdownId, requesterArenaUserId);
        if (showdown.status === 'complete') {
            throw new BadRequestException('Tournament has already ended.');
        }
        const [updated] = await this.db.update(schema.showdowns)
            .set({ status: 'complete', championId: null }) // null championId = cancelled, not won
            .where(eq(schema.showdowns.id, showdownId))
            .returning();
        return updated;
    }

    async deleteTournament(showdownId: string, requesterArenaUserId: string) {
        await this.assertOwner(showdownId, requesterArenaUserId);
        await this.db.delete(schema.showdowns).where(eq(schema.showdowns.id, showdownId));
        return { deleted: true };
    }

    /** Wipes the bracket back to an empty lobby — same showdown row, fresh start. */
    async resetTournament(showdownId: string, requesterArenaUserId: string) {
        await this.assertOwner(showdownId, requesterArenaUserId);

        return this.db.transaction(async (tx) => {
            // Deleting participants cascades to matches (playerAId/playerBId both
            // reference showdown_participants with onDelete: 'cascade'), which in
            // turn cascades to match_questions and answers. One delete clears the
            // whole bracket tree.
            await tx.delete(schema.showdownParticipants).where(eq(schema.showdownParticipants.showdownId, showdownId));

            const [updated] = await tx.update(schema.showdowns)
                .set({ status: 'lobby', totalRounds: null, championId: null })
                .where(eq(schema.showdowns.id, showdownId))
                .returning();
            return updated;
        });
    }
    // ── Helpers ──────────────────────────────────────────────────────────

    private async computeMatchScores(matchId: string): Promise<Record<string, number>> {
        const rows = await this.db
            .select({
                participantId: schema.showdownAnswers.participantId,
                points: schema.showdownAnswers.pointsAwarded,
            })
            .from(schema.showdownAnswers)
            .innerJoin(
                schema.showdownMatchQuestions,
                eq(schema.showdownAnswers.matchQuestionId, schema.showdownMatchQuestions.id),
            )
            .where(eq(schema.showdownMatchQuestions.matchId, matchId));

        return rows.reduce<Record<string, number>>((acc, r) => {
            acc[r.participantId] = (acc[r.participantId] ?? 0) + r.points;
            return acc;
        }, {});
    }

    private async pickUnusedQuestionFor(showdownId: string) {
        const showdown = await this.getShowdownOrThrow(showdownId);
        const used = await this.db
            .select({ questionId: schema.showdownMatchQuestions.questionId })
            .from(schema.showdownMatchQuestions)
            .innerJoin(
                schema.showdownMatches,
                eq(schema.showdownMatchQuestions.matchId, schema.showdownMatches.id),
            )
            .where(eq(schema.showdownMatches.showdownId, showdownId));

        return this.questionsService.pickUnused(showdown.courseId, used.map((u) => u.questionId));
    }

    private async getMatchOrThrow(matchId: string, showdownId: string) {
        const match = await this.db.query.showdownMatches.findFirst({
            where: (m, { eq, and }) => and(eq(m.id, matchId), eq(m.showdownId, showdownId)),
        });
        if (!match) throw new NotFoundException('Match not found.');
        return match;
    }

    private async getShowdownOrThrow(showdownId: string) {
        const showdown = await this.db.query.showdowns.findFirst({
            where: (s, { eq }) => eq(s.id, showdownId),
        });
        if (!showdown) throw new NotFoundException('Showdown not found.');
        return showdown;
    }

    /** Tournament-only authorization: creator or an admin. Not used by the duel flow. */
    private async assertOwner(showdownId: string, requesterArenaUserId: string) {
        const showdown = await this.getShowdownOrThrow(showdownId);

        if (showdown.createdBy !== requesterArenaUserId) {
            const requester = await this.db.query.arenaUser.findFirst({
                where: (u, { eq }) => eq(u.id, requesterArenaUserId),
            });
            if (requester?.role !== 'admin') {
                throw new ForbiddenException('Only the creator or an admin can control this showdown.');
            }
        }
        return showdown;
    }

    // ── Async Duel Phase ────────────────────────────────────────────────
    
    async createAsyncDuelChallenge(initiatorArenaUserId: string, dto: {
        courseId: string; opponentArenaUserId: string;
        questionsPerMatch?: number; timeLimitSeconds?: number;
    }) {
        if (initiatorArenaUserId === dto.opponentArenaUserId) {
            throw new BadRequestException('Cannot challenge yourself.');
        }

        return this.db.transaction(async (tx) => {
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 48); // default 48h expiry

            const [showdown] = await tx.insert(schema.showdowns).values({
                courseId: dto.courseId,
                createdBy: initiatorArenaUserId,
                title: 'Async Duel',
                mode: 'async_duel',
                status: 'challenge_pending', // Will transition to 'live' immediately in async, or we can use 'live' from start since no ready check. Let's use 'live' for async.
                questionsPerMatch: dto.questionsPerMatch ?? 3,
                timeLimitSeconds: dto.timeLimitSeconds ?? 20,
                matchCountdownMs: 0,
                totalRounds: 1,
                expiresAt,
            }).returning();

            const participants = await tx.insert(schema.showdownParticipants).values([
                { showdownId: showdown.id, arenaUserId: initiatorArenaUserId },
                { showdownId: showdown.id, arenaUserId: dto.opponentArenaUserId },
            ]).returning();

            const [match] = await tx.insert(schema.showdownMatches).values({
                showdownId: showdown.id,
                round: 0,
                matchIndex: 0,
                playerAId: participants[0].id,
                playerBId: participants[1].id,
                status: 'active', // async match is always active until complete
                startedAt: new Date(),
            }).returning();

            // Pre-select questions for both players so they are identical
            const limit = showdown.questionsPerMatch;
            const bank = await tx.query.arenaQuestions.findMany({
                where: (q, { eq }) => eq(q.courseId, showdown.courseId),
            });
            const picked = bank.sort(() => Math.random() - 0.5).slice(0, limit);

            if (picked.length < limit) {
                throw new BadRequestException('Not enough questions in the course bank.');
            }

            await tx.insert(schema.showdownMatchQuestions).values(
                picked.map((q, i) => ({
                    matchId: match.id,
                    questionId: q.id,
                    questionNumber: i + 1,
                    timeLimitSeconds: showdown.timeLimitSeconds,
                }))
            );

            await tx.update(schema.showdowns)
                .set({ status: 'live' })
                .where(eq(schema.showdowns.id, showdown.id));

            return showdown;
        });
    }

    async submitAsyncAnswers(
        showdownId: string,
        arenaUserId: string,
        answers: { questionNumber: number; optionIndex: number; timeSpentMs: number }[]
    ) {
        const showdown = await this.getShowdownOrThrow(showdownId);
        if (showdown.mode !== 'async_duel') {
            throw new BadRequestException('Not an async duel.');
        }

        const participant = await this.db.query.showdownParticipants.findFirst({
            where: (p, { eq, and }) => and(eq(p.showdownId, showdownId), eq(p.arenaUserId, arenaUserId)),
        });

        if (!participant) {
            throw new ForbiddenException('Not a participant in this duel.');
        }

        if (participant.completedAt) {
            throw new BadRequestException('You have already completed this duel.');
        }

        return this.db.transaction(async (tx) => {
            const match = await tx.query.showdownMatches.findFirst({
                where: (m, { eq }) => eq(m.showdownId, showdownId),
                with: { questions: { with: { question: true } } },
            });

            if (!match) throw new NotFoundException('Match not found.');

            let totalScore = 0;

            for (const ans of answers) {
                const mq = match.questions.find(q => q.questionNumber === ans.questionNumber);
                if (!mq) continue;

                const isCorrect = ans.optionIndex === mq.question.correctIndex;
                const timeLimitMs = mq.timeLimitSeconds * 1000;
                
                const speedBonus = isCorrect
                    ? Math.max(0, Math.round(500 * (1 - ans.timeSpentMs / timeLimitMs)))
                    : 0;
                const pointsAwarded = isCorrect ? 1000 + speedBonus : 0;
                
                totalScore += pointsAwarded;

                try {
                    await tx.insert(schema.showdownAnswers).values({
                        matchQuestionId: mq.id,
                        participantId: participant.id,
                        optionIndex: ans.optionIndex,
                        isCorrect,
                        pointsAwarded,
                    });
                } catch (err: any) {
                    if (err?.cause?.code !== '23505') throw err;
                }
            }

            await tx.update(schema.showdownParticipants)
                .set({ completedAt: new Date(), asyncScore: totalScore })
                .where(eq(schema.showdownParticipants.id, participant.id));

            // Check if both completed
            const allParticipants = await tx.query.showdownParticipants.findMany({
                where: (p, { eq }) => eq(p.showdownId, showdownId),
            });
            const pA = allParticipants.find(p => p.id === match.playerAId);
            const pB = allParticipants.find(p => p.id === match.playerBId);

            if (pA?.completedAt && pB?.completedAt) {
                const winnerId = (pA.asyncScore ?? 0) >= (pB.asyncScore ?? 0) ? pA.id : pB.id;
                
                await tx.update(schema.showdownMatches)
                    .set({ winnerId, status: 'complete', completedAt: new Date() })
                    .where(eq(schema.showdownMatches.id, match.id));

                await tx.update(schema.showdowns)
                    .set({ championId: winnerId, status: 'complete' })
                    .where(eq(schema.showdowns.id, showdownId));
            }
            
            return { success: true };
        });
    }

    async searchCourseMembers(courseId: string, arenaUserId: string, query: string) {
        if (!query || query.length < 2) return [];

        const members = await this.db.query.arenaUser.findMany({
            where: (u, { eq }) => eq(u.schoolId, (
                this.db.select({ schoolId: schema.arenaCourses.schoolId })
                    .from(schema.arenaCourses)
                    .where(eq(schema.arenaCourses.id, courseId))
            )),
            with: { user: true },
        });

        const queryLower = query.toLowerCase();
        return members
            .filter(m => m.id !== arenaUserId && m.user.username.toLowerCase().includes(queryLower))
            .map(m => ({
                id: m.id,
                username: m.user.username,
                // Using a mock rank/win rate since this isn't implemented in schema yet
                rank: 1,
                winRate: 50,
            }));
    }

    async getAsyncDuelsList(courseId: string, arenaUserId: string) {
        const duels = await this.db.query.showdowns.findMany({
            where: (s, { eq, and }) => and(
                eq(s.courseId, courseId),
                eq(s.mode, 'async_duel')
            ),
            with: {
                participants: { with: { arenaUser: { with: { user: true } } } },
                matches: true
            },
            orderBy: (s, { desc }) => [desc(s.createdAt)],
        });

        // Filter to only those where the user is a participant
        return duels.filter(d => d.participants.some(p => p.arenaUserId === arenaUserId));
    }

    // ── Shared: answer submission (both tournament and duel modes) ──────


    /** Called by a participant socket. Enforces one answer per player per question at the DB level. */
    async submitAnswer(
        matchQuestionId: string,
        participantId: string,
        optionIndex: number,
    ) {
        const mq = await this.db.query.showdownMatchQuestions.findFirst({
            where: (q, { eq }) => eq(q.id, matchQuestionId),
            with: { question: true },
        });
        if (!mq || !mq.startedAt || !mq.endsAt) {
            throw new BadRequestException('Question is not active.');
        }
        const now = Date.now();
        if (now < mq.startedAt.getTime()) {
            throw new BadRequestException('Countdown has not finished yet.');
        }
        if (now > mq.endsAt.getTime()) {
            throw new BadRequestException('Time is up for this question.');
        }

        const isCorrect = optionIndex === mq.question.correctIndex;
        const timeLimitMs = mq.timeLimitSeconds * 1000;
        const elapsed = now - mq.startedAt.getTime();
        const speedBonus = isCorrect
            ? Math.max(0, Math.round(500 * (1 - elapsed / timeLimitMs)))
            : 0;
        const pointsAwarded = isCorrect ? 1000 + speedBonus : 0;

        // Unique index (matchQuestionId, participantId) makes double-answers a DB error,
        // not a race condition — catch and treat as a no-op.
        try {
            await this.db.insert(schema.showdownAnswers).values({
                matchQuestionId,
                participantId,
                optionIndex,
                isCorrect,
                pointsAwarded,
            });
        } catch (err: any) {
            if (err?.cause?.code === '23505') {
                return; // already answered — ignore silently
            }
            throw err;
        }
    }
}