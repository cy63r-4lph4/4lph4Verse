import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards, Logger, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { WsJwtGuard, extractSocketToken } from '../gateway/strategies/ws-jwt.guard';
import { ArenaIdentityService } from '../arena/arena-identity.service';
import { PresenceService } from '../presence/presence.service';

function courseRoomFor(courseId: string) {
  return `feed:${courseId}`;
}

const HEARTBEAT_INTERVAL_MS = 15_000; // well under the 30s online TTL

@WebSocketGateway({ namespace: '/feed', cors: { origin: '*' } })
export class FeedGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(FeedGateway.name);
  private heartbeatTimers = new Map<string, NodeJS.Timeout>(); // socket.id -> timer
  private presenceTickers = new Map<string, NodeJS.Timeout>(); // courseId -> tick
  private courseRefCount  = new Map<string, number>();          // courseId -> # of joined sockets

  private readonly PRESENCE_TICK_MS = 20_000;

  constructor(
    private readonly identity: ArenaIdentityService,
    private readonly jwtService: JwtService,
    private readonly presence: PresenceService,
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = extractSocketToken(client);
      if (!token) return;
      const payload = this.jwtService.verify(token);
      const arenaUser = await this.identity.resolve(payload.sub);
      (client.data as any).arenaUserId = arenaUser.id;

      const record = await this.db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, payload.sub),
      });
      (client.data as any).username = record?.username ?? 'Unknown';
    } catch {
      // unauthenticated socket — presence just won't track it
    }
  }

  handleDisconnect(client: Socket) {
    // Clear the heartbeat for this socket
    const timer = this.heartbeatTimers.get(client.id);
    if (timer) clearInterval(timer);
    this.heartbeatTimers.delete(client.id);

    const courseId = (client.data as any)?.courseId;
    const arenaUserId = (client.data as any)?.arenaUserId;
    if (courseId && arenaUserId) {
      // Mark offline immediately so the next broadcast shows the correct state
      this.presence.markOffline(courseId, arenaUserId).then(() =>
        this.broadcastPresence(courseId)
      );

      // Decrement the ref-count; stop the ticker when no one is in the room
      const count = (this.courseRefCount.get(courseId) ?? 1) - 1;
      if (count <= 0) {
        this.courseRefCount.delete(courseId);
        const ticker = this.presenceTickers.get(courseId);
        if (ticker) {
          clearInterval(ticker);
          this.presenceTickers.delete(courseId);
        }
      } else {
        this.courseRefCount.set(courseId, count);
      }
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('feed:join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { courseId: string },
  ) {
    await client.join(courseRoomFor(payload.courseId));
    (client.data as any).courseId = payload.courseId;

    const arenaUserId = (client.data as any).arenaUserId;
    const username = (client.data as any).username;
    if (!arenaUserId) return;

    await this.presence.heartbeat(payload.courseId, arenaUserId, username);
    await this.broadcastPresence(payload.courseId);

    // Clear any existing heartbeat timer to prevent duplication on re-joins
    const existingTimer = this.heartbeatTimers.get(client.id);
    if (existingTimer) clearInterval(existingTimer);

    // Keep refreshing the Redis TTL while this socket is alive
    const timer = setInterval(async () => {
      await this.presence.heartbeat(payload.courseId, arenaUserId, username);
    }, HEARTBEAT_INTERVAL_MS);
    this.heartbeatTimers.set(client.id, timer);

    // Start a per-course presence tick if not already running.
    // This catches fighters who drop without a clean disconnect.
    const refCount = (this.courseRefCount.get(payload.courseId) ?? 0) + 1;
    this.courseRefCount.set(payload.courseId, refCount);
    if (refCount === 1) {
      const ticker = setInterval(() => {
        this.broadcastPresence(payload.courseId);
      }, this.PRESENCE_TICK_MS);
      this.presenceTickers.set(payload.courseId, ticker);
    }
  }

  /** Allow clients to request a fresh presence snapshot without a full re-join. */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('presence:refresh')
  async handlePresenceRefresh(@ConnectedSocket() client: Socket) {
    const courseId = (client.data as any)?.courseId;
    if (courseId) await this.broadcastPresence(courseId);
  }

  private async broadcastPresence(courseId: string) {
    const list = await this.presence.listPresence(courseId);
    this.server.to(courseRoomFor(courseId)).emit('feed:presence', list);
  }

  notifyNewPost(courseId: string, post: unknown) {
    this.server.to(courseRoomFor(courseId)).emit('feed:new-post', post);
  }

  notifyNewComment(postId: string, comment: unknown) {
    this.server.emit('feed:new-comment', { postId, comment });
  }

  notifyReaction(postId: string, payload: { arenaUserId: string; type: string; active: boolean }) {
    this.server.emit('feed:reaction', { postId, ...payload });
  }
  notifyTournamentLive(courseId: string, payload: { showdownId: string; title: string }) {
    this.server.to(`feed:${courseId}`).emit('tournament:live', payload);
  }
}