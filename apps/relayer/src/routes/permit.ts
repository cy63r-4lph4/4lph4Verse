import { Router } from "express";
import { coreTokenWrite } from "../services/coreToken";
import { verifyTypedData, recoverTypedDataAddress } from "viem";
import { buildPermitTypedData } from "../utils/permitTypedData";
import { keccak256 } from "viem";
import { isSignatureUsed, markSignatureUsed } from "../utils/replayStore";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { owner, spender, value, nonce, deadline, signature, chainId } = req.body;

    if (!owner || !spender || !value || !signature || chainId === undefined) {
      return res.status(400).send({ error: "Missing fields" });
    }

    const typedData = buildPermitTypedData(chainId);

    const message = { owner, spender, value, nonce, deadline };

    const valid = await verifyTypedData({
      ...typedData,
      primaryType: "Permit",
      message,
      address: owner,
      signature,
    });
    if (!valid) return res.status(401).send({ error: "Invalid signature" });

    const recovered = await recoverTypedDataAddress({
      ...typedData,
      primaryType: "Permit",
      message,
      signature,
    });
    if (recovered.toLowerCase() !== owner.toLowerCase()) {
      return res.status(401).send({ error: "Signature mismatch" });
    }

    const hash = keccak256(signature as `0x${string}`);
    if (isSignatureUsed(hash))
      return res.status(409).send({ error: "Signature reused" });
    markSignatureUsed(hash);

    // extract signature parts
    const r = signature.slice(0, 66);
    const s = `0x${signature.slice(66, 130)}`;
    const v = Number(`0x${signature.slice(130, 132)}`);

    const txHash = await coreTokenWrite(chainId, "permit", [
      owner,
      spender,
      value,
      deadline,
      v,
      r,
      s,
    ]);

    res.send({ txHash });
  } catch (err: any) {
    console.error("permit relay failed:", err);
    res.status(500).send({ error: err.message });
  }
});

export default router;
