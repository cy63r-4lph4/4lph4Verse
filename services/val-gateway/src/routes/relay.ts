import { ChainId } from "@verse/sdk/dist";
import express from "express";
import { makeClients } from "val/config/chains";
import { getContractChain } from "val/utils/contractChain";
import { logger } from "val/utils/logger";
import { verifyVerseSignature } from "val/utils/verifyVerseSignature";

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

relayRouter.post("/execute", async (req, res) => {
  try {
    const { chainId, target, data, from, message, signature, protocol } = req.body;
    if (!chainId || !target || !data || !from || !signature || !protocol) {
      return res
        .status(400)
        .json({
          error:
            "Missing required fields: chainId, target, data, from, signature, protocol",
        });
    }
    const valid = await verifyVerseSignature(
      target,
      protocol,
      chainId,
      from,
      message,
      signature
    );
    if (!valid) {
      return res.status(400).json({ error: "Invalid signature" });
    }
    const { chain, address } = getContractChain(protocol, chainId);
    const { walletClient, publicClient, relayer } = makeClients(chain as ChainId);

     const txHash = await walletClient.sendTransaction({
      account: relayer,
      to: address as `0x${string}`,
      data: data as `0x${string}`,
    });

    res.json({ ok: true, txHash });
  } catch (error: any) {
    logger.error(error);
    res.status(400).json({ error: error.message });
    return;
  }
});
