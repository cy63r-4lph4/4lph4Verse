import { makeClients } from "../config/chains";
import type { ChainId } from "@verse/sdk";
import { redis } from "../core/redis";
import { updateTransactionStatus } from "../core/transaction/txnStore";

export async function updatePendingTxs(): Promise<void> {
  const pendingTxs: string[] = await redis.sMembers("tx:pending");

  for (const txHash of pendingTxs) {
    try {
      const txRaw: string | null = await redis.get(`tx:${txHash}`);
      if (!txRaw) {
        await redis.sRem("tx:pending", txHash);
        continue;
      }

      const tx = JSON.parse(txRaw) as { chainId: ChainId };
      const chainId: ChainId = tx.chainId;

      const { publicClient } = makeClients(chainId);

      const formattedHash = (
        txHash.startsWith("0x") ? txHash : `0x${txHash}`
      ) as `0x${string}`;
      const receipt =
        (await publicClient.getTransactionReceipt({
          hash: formattedHash,
        })) ?? null;

      if (!receipt) continue;

      const status: "confirmed" | "failed" =
        receipt.status === "success" ? "confirmed" : "failed";
      await updateTransactionStatus(txHash, status);
      await redis.sRem("tx:pending", txHash);
    } catch (err) {
      console.error("Worker error for tx:", txHash, err);
    }
  }
}
