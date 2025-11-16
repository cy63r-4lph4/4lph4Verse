import { randomBytes } from "crypto";
import express from "express";
import { logger } from "val/utils/logger";

export const authRouter = express.Router();

const nonces = new Map<string, string>();

/**
 * @route POST /v1/auth/challenge
 * @desc Generate a challenge for the user to sign
 */

authRouter.post("/challenge", async (req, res) => {
    try{
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: "Missing address" });
  }
  const nonce = randomBytes(16).toString("hex");
  nonces.set(address.toLowerCase(), nonce);
  return res.json({
      address,
      nonce,
      message: `VAL Authentication\nNonce: ${nonce}`,
    });
}
catch (error: any) {
    logger.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
});
