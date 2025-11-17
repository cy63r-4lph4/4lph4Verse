import { randomBytes } from "crypto";
import express from "express";
import { deleteNonce, getNonce, saveNonce } from "val/core/auth/nonceStore";
import { removeRefreshToken, storeRefreshToken, verifyStoredRefreshToken } from "val/core/auth/refreshStore";
import {
  createTokens,
  verifyRefreshToken,
} from "val/core/sessions/sessionStore";
import { logger } from "val/utils/logger";
import { verifyVerseSignature } from "val/utils/verifyVerseSignature";

export const authRouter = express.Router();

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
    await saveNonce(address, nonce);
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

    const expectedNonce = await getNonce(address);
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

    await deleteNonce(address);

    const { accessToken, refreshToken } = createTokens(address);

    return res.json({
      ok: true,
      address,
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

authRouter.post("/refresh", async (req, res) => {
  const oldRefresh = req.body.refreshToken;

  // Validate cryptographically
  const session = verifyRefreshToken(oldRefresh);
  if (!session) return res.status(401).json({ error: "Invalid refresh token" });

  // Validate in Redis
  const storedAddress = await verifyStoredRefreshToken(oldRefresh);
  if (!storedAddress) {
    return res.status(401).json({ error: "Refresh token expired or revoked" });
  }

  await removeRefreshToken(oldRefresh);

  const { accessToken, refreshToken } = createTokens(session.address);

  await storeRefreshToken(refreshToken, session.address);

  return res.json({ accessToken, refreshToken });
});

