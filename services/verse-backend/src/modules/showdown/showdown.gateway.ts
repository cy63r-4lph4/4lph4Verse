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

  constructor(
    private readonly showdownService: ShowdownService,
    private readonly identity: ArenaIdentityService,
    private readonly jwtService: JwtService,
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
  ) {}

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
      await this.healStaleDuelQuestion(payload.showdownId);
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
    @MessageBody() payload: { showdownId: string; arenaUserIds: string[] },
  ) {
    await this.runControlAction(client, payload.showdownId, () =>
      this.showdownService.buildBracket(
        payload.showdownId,
        this.arenaUserId(client),
        payload.arenaUserIds,
      ),
    );
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
    await this.scheduleDuelTick(payload.showdownId);
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

    // Answers don't need a full state broadcast — just tell the room
    // someone answered, so Remote/Display can show "X of 2 answered"
    // without leaking who picked what before it's resolved.
    this.server.to(roomFor(payload.showdownId)).emit('showdown:answer-received', {
      matchId: payload.matchQuestionId,
      participantId: payload.participantId,
    });
  }

  // ── Outbound push (called from ShowdownController, not a socket event) ──

  /** Pushes a live "you've been challenged" event to the opponent if they're connected. Durable fallback (unread challenges list) is the GET /v1/showdown/duel/pending endpoint. */
  notifyChallenge(opponentArenaUserId: string, payload: {
    showdownId: string;
    fromArenaUserId: string;
    fromUsername: string;
  }) {
    this.server.to(userRoomFor(opponentArenaUserId)).emit('duel:challenge-received', payload);
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

  /** Duel: reads the currently-active match question and schedules its auto-resolve. Self-reschedules on every subsequent question until the duel completes. */
  private async scheduleDuelTick(showdownId: string) {
    const state = await this.showdownService.getFullState(showdownId);
    if (state.showdown.mode !== 'duel' || state.showdown.status !== 'live') return;

    const match = state.matches[0];
    const activeQ = match?.questions.at(-1);
    if (!activeQ?.endsAt) return;

    const delay = new Date(activeQ.endsAt).getTime() - Date.now();
    setTimeout(async () => {
      await this.showdownService.autoResolveDuelQuestion(showdownId, match.id);
      await this.broadcastState(showdownId);
      await this.scheduleDuelTick(showdownId); // recurse until finalizeDuel stops producing a new question
    }, Math.max(0, delay));
  }

  /** Called on every showdown:join. If a duel's active question's endsAt has already passed (server restarted, timer lost), resolve it immediately and pick the loop back up. */
  private async healStaleDuelQuestion(showdownId: string) {
    const state = await this.showdownService.getFullState(showdownId);
    if (state.showdown.mode !== 'duel' || state.showdown.status !== 'live') return;

    const match = state.matches[0];
    const activeQ = match?.questions.at(-1);
    if (!activeQ?.endsAt) return;

    if (new Date(activeQ.endsAt).getTime() <= Date.now()) {
      await this.showdownService.autoResolveDuelQuestion(showdownId, match.id);
      this.scheduleDuelTick(showdownId); // resume ticking for whatever question comes next
    } else {
      this.scheduleDuelTick(showdownId); // still within window — just make sure a tick is scheduled
    }
  }

  private async broadcastState(showdownId: string) {
    const state = await this.showdownService.getFullState(showdownId);
    this.server.to(roomFor(showdownId)).emit('showdown:state', state);
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