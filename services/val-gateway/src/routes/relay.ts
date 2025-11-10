import express from "express";
import { makeClients } from "val/config/chains";
import { logger } from "val/utils/logger";

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
    const { chainId, target, data } = req.body;
    if (!chainId || !target || !data) {
      return res
        .status(400)
        .json({ error: "Missing required fields: chainId, target, data" });
    }
    // TODO: validate signature, gas estimate, etc.
    logger.info(`🛰️  Received relay request → ${target} on chain ${chainId}`);

    res.json({ ok: true, message: "Relay endpoint alive!" });
  } catch (error: any) {
    logger.error(error);
    res.status(400).json({ error: error.message });
    return;
  }
});
