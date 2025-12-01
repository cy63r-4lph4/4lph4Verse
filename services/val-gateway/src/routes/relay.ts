import { ChainId } from "@verse/sdk";
import express from "express";
import { makeClients } from "../config/chains";
import { verifyVerseSession } from "val/core/middleware/sessionAuth";
import {
  getTransaction,
  storeTransaction,
} from "val/core/transaction/txnStore";
import { getContractChain } from "../utils/contractChain";
import { logger } from "../utils/logger";
import { verifyVerseSignature } from "val/utils/verifyVerseSignature";
import { isReplay } from "../utils/isReplay";
import { rateLimit } from "../utils/rateLimit";

export const relayRouter = express.Router();

/**
 * @route POST /v1/relay/ping
 * @desc Health check endpoint
 */

relayRouter.post("/ping", async (req, res) => {
  const { chainId } = req.body;
  try {
    const { cfg, publicClient, relayer } = makeClients(chainId);
    const block = await publicClient.getBlockNumber();
    res.json({
      status: "ok",
      network: cfg.name,
      chainId,
      relayer: relayer.address,
      latestBlock: block,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
});

/**
 * @route POST /v1/relay/execute
 * @desc Will relay signed meta-tx (stub for now)
 */

relayRouter.post("/execute", verifyVerseSession, async (req, res) => {
  try {
    const { contract, fn, chainId, from, data, message, signature } = req.body;

    if (!chainId || !contract || !from || !data || !signature || !fn) {
      return res.status(400).json({
        error:
          "Missing required fields: chainId, target, data, from, signature, protocol",
      });
    }
    const valid = await verifyVerseSignature(
      contract,
      fn,
      chainId,
      from,
      message,
      signature
    );
    if (!valid) {
      return res.status(400).json({ error: "Invalid signature" });
    }
    if (await isReplay(message, signature)) {
      return res.status(400).json({ error: "Duplicate or replayed request" });
    }
    const allowed = await rateLimit(from);
    if (!allowed) {
      return res.status(429).json({ error: "Too many requests, try later" });
    }
    const { chain, address } = getContractChain(contract, chainId);
    const { walletClient, relayer } = makeClients(chain as ChainId);

    const txHash = await walletClient.sendTransaction({
      account: relayer,
      to: address as `0x${string}`,
      chain: walletClient.chain,
      data: data as `0x${string}`,
    });
    const txPayload = {
      from,
      contract,
      chainId,
      fn,
      dataHash: data.slice(0, 10),
      status: "pending",
      createdAt: Date.now(),
    };

    await storeTransaction(txHash, txPayload);

    res.json({ ok: true, txHash });
  } catch (error: any) {
    logger.error(error);
    res.status(400).json({ error: error.message });
    return;
  }
});

relayRouter.get("/status/:txHash", async (req, res) => {
  const { txHash } = req.params;
  const tx = await getTransaction(txHash);
  if (!tx) return res.status(404).json({ error: "Transaction not found" });
  res.json(tx);
});
