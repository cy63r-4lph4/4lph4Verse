import { Router } from "express";
import { getCoreTokenClient } from "../services/coreToken";
import { verifyTypedData, recoverTypedDataAddress, parseGwei } from "viem";
import { permitTypedData } from "../utils/permitTypedData";


const router = Router();

router.post("/", async (req, res) => {
  try {
    const { owner, spender, value, nonce, deadline, signature } = req.body;
    if (!owner || !spender || !value || !signature) {
      return res.status(400).send({ error: "Invalid parameters" });
    }

    // Verify signature structure
   const isValid = await verifyTypedData({
  ...permitTypedData,
  primaryType: "Permit",
  message: { owner, spender, value, nonce, deadline },
  address: owner,
  signature
});


    if (!isValid) {
      return res.status(401).send({ error: "Invalid signature format" });
    }

    // Recover signer and make sure they match owner
    const recoveredAddress = await recoverTypedDataAddress({
      ...permitTypedData,
      primaryType: "Permit",
      message: { owner, spender, value, nonce, deadline },
      signature
    });

    if (recoveredAddress.toLowerCase() !== owner.toLowerCase()) {
      return res.status(401).send({ error: "Signature mismatch" });
    }

    // Split signature into v,r,s for EIP-2612
    const splitSig = (sig: `0x${string}`) => {
      const r = sig.slice(0, 66);
      const s = `0x${sig.slice(66, 130)}`;
      const v = Number(`0x${sig.slice(130, 132)}`);
      return { v, r, s };
    };

    const { v, r, s } = splitSig(signature);

    // Send permit transaction from relayer wallet
    const contract = getCoreTokenClient();
    const tx = await contract.write.permit(
      [owner, spender, value, deadline, v, r, s],
      {
        gas: parseGwei("20")
      }
    );

    return res.send({ txHash: tx });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send({ error: err.message });
  }
});

export default router;
