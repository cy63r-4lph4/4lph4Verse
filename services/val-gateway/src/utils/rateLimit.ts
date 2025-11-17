import { redis } from "val/core/redis";

async function rateLimit(address: string, limit = 5, ttl = 60) {
  const key = `relay:rate:${address}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, ttl);
  }

  return current <= limit;
}
