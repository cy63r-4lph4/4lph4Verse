"use client";

import { ModalWrapper } from "../profile/components/ModalWrapper";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

// Map connector.id -> logo asset in /public/wallets/
const connectorLogos: Record<string, string> = {
  metamask: "/wallets/metamask.svg",
  "io.metamask": "/wallets/metamask.svg", // sometimes shows full id
  brave: "/wallets/brave.svg",
  walletConnect: "/wallets/walletconnect.svg",
  coinbaseWallet: "/wallets/coinbase.svg",
};

export function CustomConnectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { connectAsync, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleConnect(connector: any) {
    try {
      setPendingId(connector.id);
      await connectAsync({ connector });
      setPendingId(null);
      onClose();
    } catch (err) {
    //   console.error("Connection failed", err);
      setPendingId(null);
    }
  }

  useEffect(() => {
    if (isConnected) {
      setPendingId(null);
      onClose();
    }
  }, [isConnected, onClose]);

  if (!open) return null;

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="relative z-10 w-full max-w-md sm:max-w-lg rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 p-6 sm:p-8 shadow-2xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/Verse-logo.png"
            alt="4lph4Verse Logo"
            width={72}
            height={72}
            className="rounded-xl"
          />
        </div>

        <h2 className="font-orbitron text-xl text-white mb-2 text-center">
          Connect to the 4lph4Verse
        </h2>
        <p className="text-gray-400 mb-6 text-center text-sm">
          Choose your portal to enter the Verse
        </p>

        <div className="space-y-3">
          {connectors.map((connector) => {
            const logo = connectorLogos[connector.id] || "/wallets/default.svg";
            return (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                disabled={pendingId === connector.id}
                className="flex items-center gap-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10 transition disabled:opacity-50"
              >
                <Image
                  src={logo}
                  alt={connector.name}
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
                <span className="flex-1 text-left">{connector.name}</span>
                {pendingId === connector.id && (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                )}
              </button>
            );
          })}
        </div>

        {isConnected && (
          <button
            onClick={() => disconnect()}
            className="mt-6 w-full rounded-lg bg-red-500/80 hover:bg-red-500 px-4 py-2 text-white"
          >
            Disconnect
          </button>
        )}

        {error && (
          <div className="mt-4 text-red-400 text-sm text-center">
            {error.message}
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
