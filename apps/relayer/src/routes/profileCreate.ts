// apps/relayer/src/routes/profileCreate.ts
import { Router } from "express";
import { verifyTypedData, recoverTypedDataAddress, keccak256 } from "viem";
import { verseProfileWrite } from "../services/verseProfile";
import { profileTypedData } from "../utils/profileTypedData";
import { isSignatureUsed, markSignatureUsed } from "../utils/replayStore";

const router = Router();

const ZERO_BYTES_32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

// simple handle guard to prevent junk
function isValidHandle(h: string) {
  return typeof h === "string" && /^[a-z0-9_\.]{3,32}$/i.test(h);
}

router.post("/", async (req, res) => {
  try {
    const { wallet, handle, metadataURI, signature } = req.body;

    if (!wallet || !handle || !metadataURI || !signature) {
      return res.status(400).send({ error: "Missing fields" });
    }
    if (!isValidHandle(handle)) {
      return res.status(400).send({ error: "Invalid handle format" });
    }

    // 1) verify typed data validity against expected signer
    const isValid = await verifyTypedData({
      ...profileTypedData,
      primaryType: "CreateProfile",
      message: { wallet, handle, metadataURI },
      address: wallet,
      signature,
    });
    if (!isValid) {
      return res.status(401).send({ error: "Invalid signature" });
    }

    // 2) recover signer and confirm it matches wallet
    const recovered = await recoverTypedDataAddress({
      ...profileTypedData,
      primaryType: "CreateProfile",
      message: { wallet, handle, metadataURI },
      signature,
    });
    if (recovered.toLowerCase() !== wallet.toLowerCase()) {
      return res.status(401).send({ error: "Signature mismatch" });
    }

    const signatureHash = keccak256(signature as `0x${string}`);
    if (isSignatureUsed(signatureHash)) {
      return res.status(409).send({ error: "Signature already used" });
    }

    // mark signature used BEFORE sending tx to avoid double-send race
    markSignatureUsed(signatureHash);
    // 3) write on-chain using relayer
    const txHash = await verseProfileWrite("createProfile", [
      handle,
      metadataURI,
      ZERO_BYTES_32,
    ]);

    return res.send({ txHash });
  } catch (err: any) {
    console.error("profile create failed:", err);
    return res.status(500).send({ error: err.message || "Server error" });
  }
});

export default router;
