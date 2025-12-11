import { redis } from "../../core/redis";

// 30 days in seconds
const REFRESH_TTL = 60 * 60 * 24 * 30;

export async function storeRefreshToken(token: string, address: string) {
  await redis.set(`refresh:${token}`, address, { EX: REFRESH_TTL });
}

export async function verifyStoredRefreshToken(token: string) {
  return redis.get(`refresh:${token}`);
}

export async function removeRefreshToken(token: string) {
  await redis.del(`refresh:${token}`);
}
