import { buildProfileTypedData } from "@verse/sdk/dist";
import express from "express";
import { get } from "http";
import { makeClients } from "val/config/chains";
import { logger } from "val/utils/logger";
import { getTypedDataTemplate } from "val/utils/typedData";
import { verifyTypedData } from "viem/actions";

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
    const { chainId, target, data, from, message, signature ,dapp} = req.body;
    if (!chainId || !target || !data || !from || !signature) {
      return res
        .status(400)
        .json({
          error:
            "Missing required fields: chainId, target, data, from, signature",
        });
    }
    const { domain, types, primaryType } = getTypedDataTemplate(dapp, chainId);
    const valid = await verifyTypedData({
      address: from as `0x${string}`,
      domain,
      primaryType,
      message,
      signature: signature as `0x${string}`,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(400).json({ error: error.message });
    return;
  }
});
