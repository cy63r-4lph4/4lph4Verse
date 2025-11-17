import { createClient } from "redis";
import { logger } from "val/utils/logger";

export const redis = createClient({
  url: process.env.REDIS_URL,
});


redis.on("error", (err) => logger.error("Redis Error:", err));
redis.on("connect", () => logger.info("Redis connected"));

export async function initRedis(){
    if (!redis.isOpen) {
        await redis.connect();
    }
}