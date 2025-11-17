import { redis } from "val/core/redis";
import crypto from "crypto";

export async function isReplay(message: any, signature: string) {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(message) + signature)
    .digest("hex");

  const exists = await redis.get(`relay:nonce:${hash}`);
  if (exists) return true;

  await redis.set(`relay:nonce:${hash}`, "1", { EX: 60 });
  return false;
}
