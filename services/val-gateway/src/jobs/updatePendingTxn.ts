import { makeClients } from "val/config/chains";
import { ChainId } from "@verse/sdk";
import { redis } from "val/core/redis";
import { updateTransactionStatus } from "val/core/transaction/txnStore";

async function updatePendingTxs() {
  const pendingTxs = (await redis.smembers("tx:pending")) as string[];

  for (const txHash of pendingTxs) {
    try {
      const txRaw = await redis.get(`tx:${txHash}`);
      if (!txRaw) {
        await redis.srem("tx:pending", txHash);
        continue;
      }

      const tx = JSON.parse(txRaw);
      const { chainId } = tx;

      const { publicClient } = makeClients(chainId as ChainId);

      const formattedHash = txHash.startsWith("0x") ? txHash : `0x${txHash}`;
      const receipt = await publicClient.getTransactionReceipt({
        hash: formattedHash as `0x${string}`,
      });

      if (!receipt) continue;

      const status = receipt.status === "success" ? "confirmed" : "failed";
      await updateTransactionStatus(txHash, status);
      await redis.srem("tx:pending", txHash);
    } catch (err) {
      console.error("Worker error for tx:", txHash, err);
    }
  }
}
