"use client";

import { useState } from "react";
import { useSwitchChain, useChainId } from "wagmi";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { ModalWrapper } from "../profile/components/ModalWrapper";
import TxErrorCard from "../components/ErrorCard";

type Props = { open: boolean; onClose: () => void };

/* ----------------------------------------
   Chain visuals mapping (editable per chain)
----------------------------------------- */
const CHAIN_META: Record<number, { icon: string; gradient: string }> = {
  84532: {
    icon: "/chains/base.svg",
    gradient: "from-blue-500/30 to-cyan-400/30",
  },
  11155111: {
    icon: "/chains/ethereum.svg",
    gradient: "from-gray-400/20 to-gray-200/20",
  },
  44787: {
    icon: "/chains/celo.svg",
    gradient: "from-yellow-500/30 to-lime-400/30",
  },
  4202: {
    icon: "/chains/lisk.svg",
    gradient: "from-indigo-500/30 to-purple-400/30",
  },
};

export function VerseChainModal({ open, onClose }: Props) {
  const { chains, switchChainAsync, isPending, error } = useSwitchChain();
  const currentChainId = useChainId();
  const [pendingId, setPendingId] = useState<number | null>(null);

  const handleSwitch = async (id: number) => {
    try {
      setPendingId(id);
      await switchChainAsync({ chainId: id });
      setPendingId(null);
      onClose();
    } catch (err) {
      console.error("Switch error", err);
      setPendingId(null);
    }
  };

  if (!open) return null;

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div
        className="fixed inset-x-0 bottom-0 z-10 w-full rounded-t-3xl md:static md:mx-auto md:mt-14 md:rounded-3xl md:max-w-md
        border border-indigo-400/20 bg-gradient-to-br from-zinc-950/95 to-zinc-800/90
        shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)] backdrop-blur-xl p-6"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <Image
            src="/Verse-logo.png"
            alt="Verse Logo"
            width={60}
            height={60}
          />
          <h2 className="font-orbitron text-xl text-white">
            Select your{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Chain
            </span>
          </h2>
          <p className="text-gray-400 text-sm">
            Choose which network your wallet should use.
          </p>
        </div>

        {/* Chain list */}
        <div className="space-y-3">
          {chains.map((chain) => {
            const meta = CHAIN_META[chain.id] || {
              icon: "/chains/default.svg",
              gradient: "from-zinc-700/30 to-zinc-600/30",
            };
            const isActive = chain.id === currentChainId;
            const isSwitching = pendingId === chain.id;

            return (
              <button
                key={chain.id}
                onClick={() => handleSwitch(chain.id)}
                disabled={isSwitching}
                className={`flex items-center gap-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white
                  hover:bg-gradient-to-r hover:${meta.gradient} hover:border-indigo-400/60 transition
                  disabled:opacity-50`}
              >
                <Image
                  src={meta.icon}
                  alt={chain.name}
                  width={26}
                  height={26}
                  className="rounded-sm"
                />
                <span className="flex-1 text-left font-medium">
                  {chain.name}
                </span>

                {isActive && (
                  <span className="text-xs px-2 py-1 rounded-md bg-green-500/20 text-green-400">
                    Active
                  </span>
                )}

                {isSwitching && (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4">
            <TxErrorCard error={error} />
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
