"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import WalletButton from "@verse/components/WalletButton";
import ClaimPanel from "@verse/components/ClaimPannel";
import Footer from "@verse/components/Footer";
import UtilityCards from "@verse/components/UtilityCards";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      // TODO: fetch real balance from contract
      setBalance(100); // stubbed balance
    }
  }, [isConnected, address]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-between py-6 px-4">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          C<span className="text-cyan-400">Ø</span>RE Faucet
        </h1>
        <p className="text-gray-400 text-sm">
          Get free CØRE tokens to use inside 4lph4Verse apps.
        </p>
      </header>

      {/* Wallet + Claim */}
      <section className="w-full max-w-md space-y-6">
        <WalletButton />
        {isConnected && (
          <>
            <div className="text-center text-sm text-gray-400">
              Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
              <br />
              Balance: {balance} CØRE
            </div>
            <ClaimPanel />
          </>
        )}
      </section>

      {/* Utilities */}
      <UtilityCards />

      {/* Footer */}
      <Footer />
    </main>
  );
}
