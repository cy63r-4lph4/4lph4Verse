// app/admin/page.tsx
"use client";

import {
  useAccount,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { useEffect, useState } from "react";
import { deployedContracts } from "@verse/sdk/utils/contract/deployedContracts";
import { Abi } from "viem";
import ConnectWalletButton from "@verse/sdk/ConnectWalletButton";

const chainId = 11142220; // celoSepolia
const coreToken = deployedContracts[chainId]["CoreToken"];

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // --- Owner check (since CoreToken is Ownable) ---
  const { data: owner, isLoading: ownerLoading } = useReadContract({
    abi: coreToken.abi as Abi,
    address: coreToken.address as `0x${string}`,
    functionName: "owner",
    query: { enabled: mounted }, // only after hydration
  });

  const isAdmin =
    owner && address
      ? (owner as string).toLowerCase() === address.toLowerCase()
      : false;

  // --- UI states ---
  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </main>
    );
  }

  if (!isConnected) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <ConnectWalletButton variant="primary" rounded="lg" className="mb-6" />
      </main>
    );
  }

  if (ownerLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Checking admin status...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-red-400 flex-col space-y-4">
        <p>🚫 Unauthorized — Admin access only</p>
        <button
          onClick={() => disconnect()}
          className="rounded-md border border-white/20 px-3 py-1 text-sm text-white"
        >
          Disconnect
        </button>
      </main>
    );
  }

  // --- Admin dashboard ---
  return (
    <main className="flex min-h-screen bg-gradient-to-b from-[#0b0b1f] to-black text-white">
      <aside className="w-64 border-r border-white/10 bg-black/40 p-4">
        <h2 className="mb-6 text-lg font-bold text-cyan-300">Admin Console</h2>
        <ul className="space-y-2 text-sm">
          <li className="font-semibold">CoreToken</li>
          <li className="font-semibold">Faucet</li>
          <li className="font-semibold">App Registry</li>
          <li className="font-semibold">Badge Registry</li>
          <li className="font-semibold">HireCore</li>
        </ul>
      </aside>

      <section className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">CoreToken Administration</h1>
        <p className="mb-2 text-white/70">
          Manage fees, exemptions, and transfers.
        </p>
        <CoreTokenAdmin />
      </section>
    </main>
  );
}

/* ---------- Example Admin Component ---------- */

function CoreTokenAdmin() {
  const { writeContract, isPending } = useWriteContract();
  const [addr, setAddr] = useState("");

  const handleExempt = () => {
    if (!addr) return;
    writeContract({
      abi: coreToken.abi,
      address: coreToken.address as `0x${string}`,
      functionName: "setFeeExempt",
      args: [addr as `0x${string}`, true],
    });
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h2 className="mb-2 font-semibold text-cyan-200">Fee Exemption</h2>
      <input
        type="text"
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
        placeholder="0x..."
        className="mb-2 w-full rounded-md bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30"
      />
      <button
        onClick={handleExempt}
        disabled={isPending}
        className="rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-semibold"
      >
        {isPending ? "Confirming..." : "Exempt Address"}
      </button>
    </div>
  );
}
