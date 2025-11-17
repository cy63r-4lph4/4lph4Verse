import { redis } from "val/core/redis";

export async function storeTransaction(txHash: string, payload: any) {
  await redis.set(`tx:${txHash}`, JSON.stringify(payload), { EX: 60 * 60 * 24 * 7 }); // 7 days
}

export async function getTransaction(txHash: string) {
  const data = await redis.get(`tx:${txHash}`);
  return data ? JSON.parse(data) : null;
}

export async function updateTransactionStatus(txHash: string, status: string) {
  const tx = await getTransaction(txHash);
  if (!tx) return;
  tx.status = status;
  await redis.set(`tx:${txHash}`, JSON.stringify(tx), { EX: 60 * 60 * 24 * 7 });
}
