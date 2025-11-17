import { randomBytes } from "crypto";
import express from "express";
import { createSession } from "val/core/sessions/sessionStore";
import { logger } from "val/utils/logger";
import { verifyVerseSignature } from "val/utils/verifyVerseSignature";

export const authRouter = express.Router();

const nonces = new Map<string, string>();

/**
 * @route POST /v1/auth/challenge
 * @desc Generate a challenge for the user to sign
 */

authRouter.post("/challenge", async (req, res) => {
  try {
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
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
});

/**
 * @route POST /v1/auth/verify
 * @desc Verify the signed challenge & issue session token
 */
authRouter.post("/verify", async (req, res) => {
  try {
    const { address, signature, message } = req.body;

    if (!address || !signature || !message) {
      return res.status(400).json({
        error: "Missing fields: address, signature, message",
      });
    }

    const expectedNonce = nonces.get(address.toLowerCase());
    if (!expectedNonce || !message.includes(expectedNonce)) {
      return res.status(400).json({ error: "Invalid or expired nonce" });
    }

    const isValid = await verifyVerseSignature(
      address,
      "auth",
      11142220,
      address,
      message,
      signature
    );

    if (!isValid) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const token = createSession(address);

    return res.json({
      ok: true,
      address,
      token,
    });
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
