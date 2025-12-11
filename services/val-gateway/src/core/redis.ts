import { createClient, RedisClientType } from "redis";
import { logger } from "../utils/logger";

// Explicit type annotation
export const redis: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => logger.error("Redis Error:", err));
redis.on("connect", () => logger.info("Redis connected"));

export async function initRedis(): Promise<void> {
  if (!redis.isOpen) {
    await redis.connect();
  }
}
