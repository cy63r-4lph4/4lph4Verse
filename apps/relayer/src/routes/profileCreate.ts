// apps/relayer/src/routes/profileCreate.ts
import { Router } from "express";
import { verifyTypedData, recoverTypedDataAddress } from "viem";
import { verseProfileWrite } from "../services/verseProfile";
import { profileTypedData } from "../utils/profileTypedData";

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
