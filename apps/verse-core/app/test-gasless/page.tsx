"use client";

import { useAccount, useChainId, useWalletClient } from "wagmi";
import { useState } from "react";
import { ChainId, getDeployedContract } from "@verse/sdk";
import { PrimaryButton } from "@verse/ui/profile/components/ui/PrimaryButton";

export default function TestGaslessPermit() {
  const { address } = useAccount();
  const chainId = useChainId() as ChainId;
  const { data: walletClient } = useWalletClient();
  const [spender, setSpender] = useState("");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const signPermit = async () => {
    if (!walletClient || !address || !spender) return;

    try {
      setLoading(true);
      setResult("");

      const value = BigInt(Number(amount) * 10 ** 18);
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const nonce = 0;
      const CoreToken = getDeployedContract(chainId, "CoreToken").address;

      const permitTypedData = {
        domain: {
          name: "Alph4 Core",
          version: "1",
          chainId,
          verifyingContract: CoreToken,
        },
        types: {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        primaryType: "Permit",
        message: { owner: address, spender, value, nonce, deadline },
      };

      const signature = await walletClient.signTypedData({
        domain: permitTypedData.domain,
        types: permitTypedData.types,
        primaryType: "Permit",
        message: permitTypedData.message,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_RELAYER_URL}/relay/permit`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            owner: address,
            spender,
            value: value.toString(),
            nonce,
            deadline,
            signature,
          }),
        }
      );

      const data = await res.json();
      if (data.txHash) {
        setResult(`✅ Success! Tx Hash: ${data.txHash}`);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (e: unknown) {
      setResult(
        `❌ Failed: ${e instanceof Error ? e.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg p-6 text-center space-y-4">
      <h2 className="text-xl font-bold">Gasless Permit Test</h2>

      <input
        className="w-full p-2 border rounded"
        placeholder="Spender address"
        value={spender}
        onChange={(e) => setSpender(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount of CØRE"
      />

      <PrimaryButton
        onClick={signPermit}
        className="px-4 py-2 bg-purple-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Sending..." : "Sign and Relay Permit"}
      </PrimaryButton>

      {result && <p className="text-sm break-all">{result}</p>}
    </div>
  );
}
