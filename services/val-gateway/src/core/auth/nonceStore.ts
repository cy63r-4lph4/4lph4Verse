import { redis } from "../../core/redis";

const NONCE_TTL = 60;

export async function saveNonce(address: string, nonce: string) {
  await redis.set(`nonce:${address.toLowerCase()}`, nonce, { EX: NONCE_TTL });
}
export async function getNonce(address: string) {
  return redis.get(`nonce:${address.toLowerCase()}`);
}

export async function deleteNonce(address: string) {
  await redis.del(`nonce:${address.toLowerCase()}`);
}