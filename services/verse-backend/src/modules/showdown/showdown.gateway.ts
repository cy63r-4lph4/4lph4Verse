import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards, Logger, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { WsJwtGuard, extractSocketToken } from '../gateway/strategies/ws-jwt.guard';
import { ShowdownService } from './showdown.service';
import { ArenaIdentityService } from '../arena/arena-identity.service';

function roomFor(showdownId: string) {
  return `showdown:${showdownId}`;
}
function userRoomFor(arenaUserId: string) {
  return `arena-user:${arenaUserId}`;
}

@WebSocketGateway({ namespace: '/showdown', cors: { origin: '*' } })
export class ShowdownGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ShowdownGateway.name);
  /** One timer handle per live duel — prevents duplicate tick loops from concurrent joins. */
  private readonly duelTimers = new Map<string, NodeJS.Timeout>();
  /** showdownId -> set of arenaUserIds currently connected to that showdown's room. Only meaningfully used for duel challenge_pending/ready_check gating. */
  private readonly duelPresence = new Map<string, Set<string>>();
  /** client.id -> last showdownId it joined, so we can clean up on disconnect. */
  private readonly clientShowdown = new Map<string, string>();

  constructor(
    private readonly showdownService: ShowdownService,
    private readonly identity: ArenaIdentityService,
    private readonly jwtService: JwtService,
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
  ) { }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    try {
      const token = extractSocketToken(client);
      if (!token) return; // unauthenticated socket — fine, just can't receive pushes yet

      const payload = this.jwtService.verify(token);
      const arenaUser = await this.identity.resolve(payload.sub);

      (client.data as any).user = { id: payload.sub, username: payload.username };
      (client.data as any).arenaUserId = arenaUser.id;
      (client.data as any).role = arenaUser.role;

      await client.join(userRoomFor(arenaUser.id));
    } catch {
      // Invalid/expired token at connect time — let it fail later at the
      // WsJwtGuard on their first real action rather than killing the socket here.
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const showdownId = this.clientShowdown.get(client.id);
    const arenaUserId = (client.data as any)?.arenaUserId;
    if (showdownId && arenaUserId) {
      this.duelPresence.get(showdownId)?.delete(arenaUserId);
    }
    this.clientShowdown.delete(client.id);
  }

  // ── Join / resync ────────────────────────────────────────────────────

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('showdown:join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { showdownId: string },
  ) {
    try {
      await client.join(roomFor(payload.showdownId));
      this.clientShowdown.set(client.id, payload.showdownId);
      await this.healStaleDuelQuestion(payload.showdownId);
      await this.trackDuelPresence(payload.showdownId, this.arenaUserId(client));
      const state = await this.showdownService.getFullState(payload.showdownId);
      client.emit('showdown:state', state);
    } catch (err: any) {
      client.emit('showdown:error', { message: err.message ?? 'Failed to join showdown.' });
    }
  }

  // ── Tournament control events (instructor/admin) ─────────────────────
  // Each of these delegates authorization to ShowdownService's internal
  // assertOwner check — the gateway does not duplicate that check, it just
  // surfaces the resulting error.

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('showdown:build-bracket')
  async handleBuildBracket(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { showdownId: string; arenaUserIds: string[]; courseId?: string; title?: string },
  ) {
    await this.runControlAction(client, payload.showdownId, () =>
      this.showdownService.buildBracket(
        payload.showdownId,
        this.arenaUserId(client),
        payload.arenaUserIds,
      ),
    );
    if (payload.courseId && payload.title) {
      this.notifyCourseTournamentLive(payload.courseId, payload.showdownId, payload.title);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('showdown:start-match')
  async handleStartMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { showdownId: string; matchId: string },
  ) {
    await this.runControlAction(client, payload.showdownId, () =>
      this.showdownService.startMatch(
        payload.showdownId,
        payload.matchId,
        this.arenaUserId(client),
      ),
    );
    await this.scheduleTournamentTimeUp(payload.showdownId, payload.matchId);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('showdown:resolve-question')
  async handleResolveQuestion(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { showdownId: string; matchId: string },
  ) {
    await this.runControlAction(client, payload.showdownId, () =>
      this.showdownService.resolveQuestion(
        payload.showdownId,
        payload.matchId,
        this.arenaUserId(client),
      ),
    );
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('showdown:next-question')
  async handleNextQuestion(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { showdownId: string; matchId: string },
  ) {
    await this.runControlAction(client, payload.showdownId, () =>
      this.showdownService.nextQuestion(
        payload.showdownId,
        payload.matchId,
        this.arenaUserId(client),
      ),
    );
    await this.scheduleTournamentTimeUp(payload.showdownId, payload.matchId);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('showdown:advance')
  async handleAdvance(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { showdownId: string },
  ) {
    await this.runControlAction(client, payload.showdownId, () =>
      this.showdownService.advance(payload.showdownId, this.arenaUserId(client)),
    );
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('showdown:reset')
  async handleReset(@ConnectedSocket() client: Socket, @MessageBody() payload: { showdownId: string }) {
    await this.runControlAction(client, payload.showdownId, () =>
      this.showdownService.resetTournament(payload.showdownId, this.arenaUserId(client)),
    );
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('showdown:cancel')
  async handleCancel(@ConnectedSocket() client: Socket, @MessageBody() payload: { showdownId: string }) {
    await this.runControlAction(client, payload.showdownId, () =>
      this.showdownService.cancelTournament(payload.showdownId, this.arenaUserId(client)),
    );
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('showdown:toggle-qr')
  async handleToggleQr(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { showdownId: string; show: boolean },
  ) {
    this.server.to(roomFor(payload.showdownId)).emit('showdown:qr-toggle', { show: payload.show });
  }

  // ── Duel control events (peer-initiated) ──────────────────────────────

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('duel:accept')
  async handleAcceptDuel(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { showdownId: string },
  ) {
    try {
      await this.showdownService.acceptDuelChallenge(payload.showdownId, this.arenaUserId(client));
    } catch (err: any) {
      client.emit('showdown:error', { message: err.message });
      return;
    }
    await this.broadcastState(payload.showdownId);
    // Notify both participants' personal rooms so their feed refetches immediately
    await this.notifyParticipantsOfStatusChange(payload.showdownId);
    // Do not start the tick loop here — activation happens once both
    // participants are confirmed present, via trackDuelPresence below.
    await this.trackDuelPresence(payload.showdownId, this.arenaUserId(client));
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('duel:decline')
  async handleDeclineDuel(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { showdownId: string },
  ) {
    try {
      await this.showdownService.declineDuelChallenge(payload.showdownId, this.arenaUserId(client));
    } catch (err: any) {
      client.emit('showdown:error', { message: err.message });
      return;
    }
    await this.broadcastState(payload.showdownId);
    // Notify both participants so the challenger's feed also updates
    await this.notifyParticipantsOfStatusChange(payload.showdownId);
  }

  // ── Participant events (shared by both modes) ─────────────────────────

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('showdown:answer')
  async handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: {
      showdownId: string;
      matchQuestionId: string;
      participantId: string; // must belong to this user — checked below
      optionIndex: number;
    },
  ) {
    const arenaUserId = this.arenaUserId(client);

    // Never trust participantId from the payload at face value — confirm
    // it actually maps back to the socket's own arena_user row.
    const participant = await this.db.query.showdownParticipants.findFirst({
      where: (p, { eq, and }) => and(
        eq(p.id, payload.participantId),
        eq(p.arenaUserId, arenaUserId ?? ''),
      ),
    });
    if (!participant) {
      client.emit('showdown:error', { message: 'Not your participant slot.' });
      return;
    }

    try {
      await this.showdownService.submitAnswer(
        payload.matchQuestionId,
        payload.participantId,
        payload.optionIndex,
      );
    } catch (err: any) {
      client.emit('showdown:error', { message: err.message ?? 'Could not submit answer.' });
      return;
    }

    // Broadcast full state immediately so the answering client's alreadyAnswered
    // flag updates without waiting for the auto-resolve timer — but redact
    // optionIndex/isCorrect on the still-active question so the opponent
    // cannot see what was picked before the question is resolved.
    await this.broadcastAnswerState(payload.showdownId);
  }

  // ── Outbound push (called from ShowdownController, not a socket event) ──

  notifyChallenge(opponentArenaUserId: string, payload: {
    showdownId: string;
    courseId: string;
    fromArenaUserId: string;
    fromUsername: string;
  }) {
    // Private push to the opponent (shows accept/decline card)
    this.server.to(userRoomFor(opponentArenaUserId)).emit('duel:challenge-received', payload);
    // Private push to the challenger (their sent challenges list)
    this.server.to(userRoomFor(payload.fromArenaUserId)).emit('duel:challenge-sent', payload);
    // Public push to the entire course feed room (everyone sees the activity card)
    this.broadcastCourseActivity(payload.courseId, 'duel:feed-activity');
  }

  /** Emits a signal to the course feed room that invalidates feed queries for all members.
   * Used so every fighter in the course sees challenge/accept/live events in real time. */
  private broadcastCourseActivity(courseId: string, event: string, data?: Record<string, unknown>) {
    this.server.to(`feed:${courseId}`).emit(event, data ?? {});
  }

  /** Emits `showdown:state` to every participant's personal room AND a
   * `duel:feed-activity` event to the whole course feed room so all fighters
   * see the status change (accepted, live, declined) in real time.
   */
  private async notifyParticipantsOfStatusChange(showdownId: string) {
    const state = await this.showdownService.getFullState(showdownId);
    for (const p of state.participants) {
      this.server.to(userRoomFor(p.arenaUserId)).emit('showdown:state', state);
    }
    // Broadcast to the whole course so spectators see it too
    this.broadcastCourseActivity(state.showdown.courseId, 'duel:feed-activity');
  }

  // ── Scheduling helpers ─────────────────────────────────────────────────

  /** Tournament: broadcasts a notice when the answer window closes. Does not auto-advance — the instructor still drives resolve/next via Remote. */
  private async scheduleTournamentTimeUp(showdownId: string, matchId: string) {
    const state = await this.showdownService.getFullState(showdownId);
    const match = state.matches.find((m) => m.id === matchId);
    const activeQ = match?.questions.at(-1);
    if (!activeQ?.endsAt) return;

    const delay = new Date(activeQ.endsAt).getTime() - Date.now();
    setTimeout(() => {
      this.server.to(roomFor(showdownId)).emit('showdown:time-up', { matchId });
    }, Math.max(0, delay));
  }


  // showdown.gateway.ts — add, called from buildBracket's runControlAction success path
  private notifyCourseTournamentLive(courseId: string, showdownId: string, title: string) {
    this.server.to(`feed:${courseId}`).emit('tournament:live', { showdownId, title });
  }

  /** Duel: reads the currently-active match question and schedules its auto-resolve.
   * Always cancels any existing timer for the showdown first — guarantees exactly
   * one tick loop per duel regardless of how many clients join/rejoin. */
  private async scheduleDuelTick(showdownId: string) {
    const state = await this.showdownService.getFullState(showdownId);
    if (state.showdown.mode !== 'duel' || state.showdown.status !== 'live') {
      this.duelTimers.delete(showdownId);
      return;
    }

    const match = state.matches[0];
    const activeQ = match?.questions.at(-1);
    if (!activeQ?.endsAt) return;

    // Cancel any previous timer before scheduling a new one.
    const existing = this.duelTimers.get(showdownId);
    if (existing) clearTimeout(existing);

    const delay = new Date(activeQ.endsAt).getTime() - Date.now();
    const handle = setTimeout(async () => {
      this.duelTimers.delete(showdownId);
      await this.showdownService.autoResolveDuelQuestion(showdownId, match.id);
      await this.broadcastState(showdownId);
      await this.scheduleDuelTick(showdownId);
    }, Math.max(0, delay));
    this.duelTimers.set(showdownId, handle);
  }


  /** Records that this arenaUserId is connected to this duel's room. Once both
 * participants of a duel in ready_check are present, activates the match. */
  private async trackDuelPresence(showdownId: string, arenaUserId: string) {
    const state = await this.showdownService.getFullState(showdownId);
    if (state.showdown.mode !== 'duel') return;
    if (!['challenge_pending', 'ready_check'].includes(state.showdown.status)) return;

    if (!this.duelPresence.has(showdownId)) this.duelPresence.set(showdownId, new Set());
    this.duelPresence.get(showdownId)!.add(arenaUserId);

    if (state.showdown.status !== 'ready_check') return;

    const participantArenaIds = state.participants.map((p) => p.arenaUserId);
    const present = this.duelPresence.get(showdownId)!;
    const bothPresent = participantArenaIds.every((id) => present.has(id));
    if (!bothPresent) return;

    await this.showdownService.activateReadyDuel(showdownId);
    this.duelPresence.delete(showdownId); // no longer needed once live
    await this.broadcastState(showdownId);
    await this.scheduleDuelTick(showdownId);
  }
  /** Called on every showdown:join. Heals a stale (expired) question when the
   * server restarted and lost its timer. If a tick loop is already running for
   * this showdown we leave it alone to prevent duplicate loops. */
  private async healStaleDuelQuestion(showdownId: string) {
    const state = await this.showdownService.getFullState(showdownId);
    if (state.showdown.mode !== 'duel' || state.showdown.status !== 'live') return;

    const match = state.matches[0];
    const activeQ = match?.questions.at(-1);
    if (!activeQ?.endsAt) return;

    if (new Date(activeQ.endsAt).getTime() <= Date.now()) {
      // Question already expired (server restart lost the timer) — resolve now
      // and restart the loop. scheduleDuelTick cancels any duplicate internally.
      await this.showdownService.autoResolveDuelQuestion(showdownId, match.id);
      await this.scheduleDuelTick(showdownId);
    } else if (!this.duelTimers.has(showdownId)) {
      // No timer running yet (fresh server boot) — safe to start one.
      await this.scheduleDuelTick(showdownId);
    }
    // If a timer already exists, do nothing — avoids creating a second loop.
  }

  private async broadcastState(showdownId: string) {
    const state = await this.showdownService.getFullState(showdownId);
    this.server.to(roomFor(showdownId)).emit('showdown:state', state);
  }

  /**
   * Like broadcastState but strips optionIndex / isCorrect / pointsAwarded
   * from answers on questions that are not yet resolved (questionNumber >
   * match.questionsCompleted). Used after answer submission so that:
   *   - The answering client's `alreadyAnswered` flag updates immediately.
   *   - The opponent cannot see which option was chosen before resolution.
   */
  private async broadcastAnswerState(showdownId: string) {
    const state = await this.showdownService.getFullState(showdownId);
    const redacted = {
      ...state,
      matches: state.matches.map((m) => ({
        ...m,
        questions: m.questions.map((q) => {
          // Active question = not yet counted in questionsCompleted
          const isActive = q.questionNumber > m.questionsCompleted;
          if (!isActive) return q;
          return {
            ...q,
            answers: q.answers.map(({ optionIndex: _o, isCorrect: _c, pointsAwarded: _p, ...rest }) => rest),
          };
        }),
      })),
    };
    this.server.to(roomFor(showdownId)).emit('showdown:state', redacted);
  }

  // ── Shared helpers ───────────────────────────────────────────────────

  private arenaUserId(client: Socket): string {
    const id = (client.data as any).arenaUserId;
    if (!id) throw new Error('Socket has not joined a showdown room yet.');
    return id;
  }

  /** Runs a mutating service call, broadcasts fresh state on success, emits a scoped error on failure. */
  private async runControlAction(
    client: Socket,
    showdownId: string,
    action: () => Promise<unknown>,
  ) {
    try {
      await action();
    } catch (err: any) {
      client.emit('showdown:error', { message: err.message ?? 'Action failed.' });
      return;
    }
    await this.broadcastState(showdownId);
  }
}