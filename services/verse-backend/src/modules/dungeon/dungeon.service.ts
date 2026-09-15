import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, notInArray, sql, desc } from 'drizzle-orm';
import * as schema from '../../db/schema';

// ── XP / Level curve ────────────────────────────────────────────────────────
// Level thresholds: XP needed to reach level N.
// Level 1 = 0 XP (everyone starts here)
// Level 2 = 500 XP, Level 3 = 1200, Level 4 = 2200, etc.
// Formula: threshold(n) = 150 * (n-1)^2 + 350 * (n-1)
function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return 150 * n * n + 350 * n;
}

function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

// ── Scoring constants ───────────────────────────────────────────────────────
const BASE_XP = 100;
const STREAK_BONUS = 25;
const MAX_STREAK_BONUS = 250; // 10-streak cap

@Injectable()
export class DungeonService {
  constructor(@Inject('DB') private db: NodePgDatabase<typeof schema>) {}

  // ── Start a new run ───────────────────────────────────────────────────

  async startRun(arenaUserId: string, courseId: string, category?: string) {
    // Abort any leftover active runs for this user+course
    await this.db
      .update(schema.dungeonRuns)
      .set({ status: 'complete', endedAt: new Date() })
      .where(
        and(
          eq(schema.dungeonRuns.arenaUserId, arenaUserId),
          eq(schema.dungeonRuns.courseId, courseId),
          eq(schema.dungeonRuns.status, 'active'),
        ),
      );

    const [run] = await this.db
      .insert(schema.dungeonRuns)
      .values({
        courseId,
        arenaUserId,
        category: category || null,
      })
      .returning();

    return run;
  }

  // ── Get the next question (adaptive algorithm) ────────────────────────

  async nextQuestion(runId: string) {
    const run = await this.getActiveRunOrThrow(runId);

    // IDs of questions already answered in this run
    const answeredInRun = await this.db
      .select({ questionId: schema.dungeonAnswers.questionId })
      .from(schema.dungeonAnswers)
      .where(eq(schema.dungeonAnswers.runId, runId));

    const excludeIds = answeredInRun.map((r) => r.questionId);

    const categoryFilter = run.category
      ? eq(schema.arenaQuestions.category, run.category)
      : undefined;

    // ── Priority 1: Questions this user previously got WRONG in showdowns ──
    const question = await this.pickMissedQuestion(
      run.arenaUserId,
      run.courseId,
      excludeIds,
      categoryFilter,
    );
    if (question) return this.sanitizeQuestion(question);

    // ── Priority 2: Questions the user has never seen ──
    const unseenQuestion = await this.pickUnseenQuestion(
      run.arenaUserId,
      run.courseId,
      excludeIds,
      categoryFilter,
    );
    if (unseenQuestion) return this.sanitizeQuestion(unseenQuestion);

    // ── Priority 3: Random backfill (user has seen everything) ──
    const randomQuestion = await this.pickRandom(
      run.courseId,
      excludeIds,
      categoryFilter,
    );
    if (randomQuestion) return this.sanitizeQuestion(randomQuestion);

    // No questions left — complete the run
    await this.completeRun(run.id);
    return null;
  }

  // ── Submit an answer ──────────────────────────────────────────────────

  async submitAnswer(runId: string, questionId: string, optionIndex: number) {
    const run = await this.getActiveRunOrThrow(runId);

    const question = await this.db.query.arenaQuestions.findFirst({
      where: (q, { eq }) => eq(q.id, questionId),
    });
    if (!question) throw new NotFoundException('Question not found.');

    const isCorrect = optionIndex === question.correctIndex;

    // Insert answer (unique index prevents double-answering)
    try {
      await this.db.insert(schema.dungeonAnswers).values({
        runId,
        questionId,
        optionIndex,
        isCorrect,
      });
    } catch (err: any) {
      if (err?.cause?.code === '23505') {
        throw new BadRequestException('Already answered this question.');
      }
      throw err;
    }

    // Calculate XP
    let xpEarned = 0;
    let newStreak = run.streak;
    let newBestStreak = run.bestStreak;
    let newLivesRemaining = run.livesRemaining;

    if (isCorrect) {
      newStreak = run.streak + 1;
      if (newStreak > newBestStreak) newBestStreak = newStreak;
      const streakBonus = Math.min(
        STREAK_BONUS * (newStreak - 1),
        MAX_STREAK_BONUS,
      );
      xpEarned = BASE_XP + streakBonus;
    } else {
      newStreak = 0;
      newLivesRemaining = run.livesRemaining - 1;
    }

    const isRunOver = newLivesRemaining <= 0;

    // Update run
    const [updatedRun] = await this.db
      .update(schema.dungeonRuns)
      .set({
        livesRemaining: newLivesRemaining,
        score: run.score + xpEarned,
        questionsAnswered: run.questionsAnswered + 1,
        questionsCorrect: run.questionsCorrect + (isCorrect ? 1 : 0),
        streak: newStreak,
        bestStreak: newBestStreak,
        ...(isRunOver
          ? { status: 'complete' as const, endedAt: new Date() }
          : {}),
      })
      .where(eq(schema.dungeonRuns.id, runId))
      .returning();

    // If run ended, award profile XP
    if (isRunOver && updatedRun.score > 0) {
      await this.awardProfileXp(run.arenaUserId, updatedRun.score);
    }

    return {
      isCorrect,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      resourceId: question.resourceId,
      xpEarned,
      streak: newStreak,
      livesRemaining: newLivesRemaining,
      score: updatedRun.score,
      isRunOver,
    };
  }

  // ── Run summary ───────────────────────────────────────────────────────

  async getRunSummary(runId: string) {
    const run = await this.db.query.dungeonRuns.findFirst({
      where: (r, { eq }) => eq(r.id, runId),
      with: {
        answers: {
          with: { question: true },
          orderBy: (a, { asc }) => [asc(a.answeredAt)],
        },
      },
    });
    if (!run) throw new NotFoundException('Dungeon run not found.');

    return {
      id: run.id,
      courseId: run.courseId,
      category: run.category,
      score: run.score,
      questionsAnswered: run.questionsAnswered,
      questionsCorrect: run.questionsCorrect,
      accuracy:
        run.questionsAnswered > 0
          ? Math.round((run.questionsCorrect / run.questionsAnswered) * 100)
          : 0,
      bestStreak: run.bestStreak,
      status: run.status,
      startedAt: run.startedAt,
      endedAt: run.endedAt,
      questions: run.answers.map((a) => ({
        questionId: a.questionId,
        prompt: a.question.prompt,
        options: a.question.options,
        correctIndex: a.question.correctIndex,
        chosenIndex: a.optionIndex,
        isCorrect: a.isCorrect,
        explanation: a.question.explanation,
      })),
    };
  }

  async listMyRuns(arenaUserId: string, courseId: string) {
    return this.db.query.dungeonRuns.findMany({
      where: (r, { eq, and }) =>
        and(eq(r.arenaUserId, arenaUserId), eq(r.courseId, courseId)),
      orderBy: (r, { desc }) => [desc(r.startedAt)],
      limit: 20,
    });
  }

  // ── Private: Adaptive question pickers ────────────────────────────────

  /**
   * Priority 1: Questions the user got wrong in showdowns but hasn't
   * subsequently answered correctly anywhere.
   */
  private async pickMissedQuestion(
    arenaUserId: string,
    courseId: string,
    excludeIds: string[],
    categoryFilter?: ReturnType<typeof eq>,
  ) {
    // Get all question IDs this user answered incorrectly in showdowns
    const missedQuestionsQuery = this.db
      .select({ questionId: schema.showdownMatchQuestions.questionId })
      .from(schema.showdownAnswers)
      .innerJoin(
        schema.showdownMatchQuestions,
        eq(
          schema.showdownAnswers.matchQuestionId,
          schema.showdownMatchQuestions.id,
        ),
      )
      .innerJoin(
        schema.showdownParticipants,
        eq(schema.showdownAnswers.participantId, schema.showdownParticipants.id),
      )
      .where(
        and(
          eq(schema.showdownParticipants.arenaUserId, arenaUserId),
          eq(schema.showdownAnswers.isCorrect, false),
        ),
      );

    const missedRows = await missedQuestionsQuery;
    const missedIds = missedRows.map((r) => r.questionId);
    if (missedIds.length === 0) return null;

    // Filter to course, exclude already-answered-this-run, apply category
    const conditions = [
      eq(schema.arenaQuestions.courseId, courseId),
      sql`${schema.arenaQuestions.id} = ANY(ARRAY[${sql.join(missedIds.map((id) => sql`${id}`), sql`, `)}]::text[])`,
    ];
    if (excludeIds.length > 0) {
      conditions.push(notInArray(schema.arenaQuestions.id, excludeIds));
    }
    if (categoryFilter) conditions.push(categoryFilter);

    const [question] = await this.db
      .select()
      .from(schema.arenaQuestions)
      .where(and(...conditions))
      .orderBy(sql`RANDOM()`)
      .limit(1);

    return question || null;
  }

  /**
   * Priority 2: Questions the user has never seen in any context.
   */
  private async pickUnseenQuestion(
    arenaUserId: string,
    courseId: string,
    excludeIds: string[],
    categoryFilter?: ReturnType<typeof eq>,
  ) {
    // All question IDs this user has ever answered (showdowns)
    const showdownSeen = this.db
      .select({ questionId: schema.showdownMatchQuestions.questionId })
      .from(schema.showdownAnswers)
      .innerJoin(
        schema.showdownMatchQuestions,
        eq(
          schema.showdownAnswers.matchQuestionId,
          schema.showdownMatchQuestions.id,
        ),
      )
      .innerJoin(
        schema.showdownParticipants,
        eq(schema.showdownAnswers.participantId, schema.showdownParticipants.id),
      )
      .where(eq(schema.showdownParticipants.arenaUserId, arenaUserId));

    // All question IDs answered in any dungeon run
    const dungeonSeen = this.db
      .select({ questionId: schema.dungeonAnswers.questionId })
      .from(schema.dungeonAnswers)
      .innerJoin(
        schema.dungeonRuns,
        eq(schema.dungeonAnswers.runId, schema.dungeonRuns.id),
      )
      .where(eq(schema.dungeonRuns.arenaUserId, arenaUserId));

    const [showdownSeenRows, dungeonSeenRows] = await Promise.all([
      showdownSeen,
      dungeonSeen,
    ]);

    const seenIds = [
      ...new Set([
        ...showdownSeenRows.map((r) => r.questionId),
        ...dungeonSeenRows.map((r) => r.questionId),
        ...excludeIds,
      ]),
    ];

    const conditions = [eq(schema.arenaQuestions.courseId, courseId)];
    if (seenIds.length > 0) {
      conditions.push(notInArray(schema.arenaQuestions.id, seenIds));
    }
    if (categoryFilter) conditions.push(categoryFilter);

    const [question] = await this.db
      .select()
      .from(schema.arenaQuestions)
      .where(and(...conditions))
      .orderBy(sql`RANDOM()`)
      .limit(1);

    return question || null;
  }

  /**
   * Priority 3: Any random question from the bank (pure backfill).
   */
  private async pickRandom(
    courseId: string,
    excludeIds: string[],
    categoryFilter?: ReturnType<typeof eq>,
  ) {
    const conditions = [eq(schema.arenaQuestions.courseId, courseId)];
    if (excludeIds.length > 0) {
      conditions.push(notInArray(schema.arenaQuestions.id, excludeIds));
    }
    if (categoryFilter) conditions.push(categoryFilter);

    const [question] = await this.db
      .select()
      .from(schema.arenaQuestions)
      .where(and(...conditions))
      .orderBy(sql`RANDOM()`)
      .limit(1);

    return question || null;
  }

  // ── Private: Profile XP ───────────────────────────────────────────────

  private async awardProfileXp(arenaUserId: string, xpEarned: number) {
    const arenaUserRow = await this.db.query.arenaUser.findFirst({
      where: (au, { eq }) => eq(au.id, arenaUserId),
    });
    if (!arenaUserRow) return;

    const newXp = arenaUserRow.xp + xpEarned;
    const newLevel = levelFromXp(newXp);

    await this.db
      .update(schema.arenaUser)
      .set({ xp: newXp, level: newLevel })
      .where(eq(schema.arenaUser.id, arenaUserId));
  }

  // ── Private: Helpers ──────────────────────────────────────────────────

  private async getActiveRunOrThrow(runId: string) {
    const run = await this.db.query.dungeonRuns.findFirst({
      where: (r, { eq }) => eq(r.id, runId),
    });
    if (!run) throw new NotFoundException('Dungeon run not found.');
    if (run.status !== 'active') {
      throw new BadRequestException('This dungeon run has already ended.');
    }
    return run;
  }

  private async completeRun(runId: string) {
    const run = await this.db.query.dungeonRuns.findFirst({
      where: (r, { eq }) => eq(r.id, runId),
    });

    const [updated] = await this.db
      .update(schema.dungeonRuns)
      .set({ status: 'complete', endedAt: new Date() })
      .where(eq(schema.dungeonRuns.id, runId))
      .returning();

    // Award profile XP for no-more-questions completion too
    if (run && updated.score > 0) {
      await this.awardProfileXp(run.arenaUserId, updated.score);
    }

    return updated;
  }

  /** Strip the correct answer from the response — the client should
   *  NOT know the answer until they submit. */
  private sanitizeQuestion(question: typeof schema.arenaQuestions.$inferSelect) {
    return {
      id: question.id,
      prompt: question.prompt,
      options: question.options,
      difficulty: question.difficulty,
      category: question.category,
    };
  }
}
