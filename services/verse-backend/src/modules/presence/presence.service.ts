import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

const ONLINE_TTL_SECONDS = 30;       // socket must refresh within this window to stay "online"
const RECENT_TTL_SECONDS = 5 * 60;   // grace window after disconnect for "recently active"

function onlineKey(courseId: string, arenaUserId: string) {
  return `presence:online:${courseId}:${arenaUserId}`;
}
function recentKey(courseId: string, arenaUserId: string) {
  return `presence:recent:${courseId}:${arenaUserId}`;
}
function courseSetKey(courseId: string) {
  return `presence:members:${courseId}`;
}

@Injectable()
export class PresenceService implements OnModuleDestroy {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  async heartbeat(courseId: string, arenaUserId: string, username: string) {
    const payload = JSON.stringify({ arenaUserId, username });
    await this.redis.set(onlineKey(courseId, arenaUserId), payload, 'EX', ONLINE_TTL_SECONDS);
    await this.redis.set(recentKey(courseId, arenaUserId), payload, 'EX', RECENT_TTL_SECONDS);
    await this.redis.sadd(courseSetKey(courseId), arenaUserId);
    // Refresh the set's own expiry so it doesn't grow unbounded across a long-lived course
    await this.redis.expire(courseSetKey(courseId), RECENT_TTL_SECONDS);
  }

  /** Explicit disconnect — lets "recently active" still show them for a while, but online status drops immediately. */
  async markOffline(courseId: string, arenaUserId: string) {
    await this.redis.del(onlineKey(courseId, arenaUserId));
  }

  async listPresence(courseId: string): Promise<{ arenaUserId: string; username: string; status: 'online' | 'recent' }[]> {
    const memberIds = await this.redis.smembers(courseSetKey(courseId));
    if (memberIds.length === 0) return [];

    const results = await Promise.all(
      memberIds.map(async (arenaUserId) => {
        const [onlineRaw, recentRaw] = await Promise.all([
          this.redis.get(onlineKey(courseId, arenaUserId)),
          this.redis.get(recentKey(courseId, arenaUserId)),
        ]);
        const raw = onlineRaw ?? recentRaw;
        if (!raw) return null; 
        const { username } = JSON.parse(raw);
        return { arenaUserId, username, status: (onlineRaw ? 'online' : 'recent') as 'online' | 'recent' };
      }),
    );

    const alive = results.filter((r): r is NonNullable<typeof r> => r !== null);

    // Lazily prune fully-expired members from the set
    const deadIds = memberIds.filter((id) => !alive.some((a) => a.arenaUserId === id));
    if (deadIds.length > 0) await this.redis.srem(courseSetKey(courseId), ...deadIds);

    return alive;
  }
}