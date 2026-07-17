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
    const timer = this.heartbeatTimers.get(client.id);
    if (timer) clearInterval(timer);
    this.heartbeatTimers.delete(client.id);

    const courseId = (client.data as any)?.courseId;
    const arenaUserId = (client.data as any)?.arenaUserId;
    if (courseId && arenaUserId) {
      this.presence.markOffline(courseId, arenaUserId).then(() => this.broadcastPresence(courseId));
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

    // Keep refreshing the TTL while this socket is alive
    const timer = setInterval(async () => {
      await this.presence.heartbeat(payload.courseId, arenaUserId, username);
    }, HEARTBEAT_INTERVAL_MS);
    this.heartbeatTimers.set(client.id, timer);
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
}