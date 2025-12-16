"use client";

import { useState } from "react";
import { Coins, ChevronDown, ChevronUp } from "lucide-react";
import { CHAIN_CONFIG, ChainId } from "@verse/sdk";
import clsx from "clsx";

type ChainBalance = {
  chainId: number;
  balance: string;
};

export function BalanceDisplay({
  total,
  perChain,
  activeChainId,
}: {
  total: string;
  perChain: ChainBalance[];
  activeChainId?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden md:block">
      {/* Collapsed balance chip (same vibe as DefaultBalance) */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-white/5 backdrop-blur-md border border-white/10",
          "hover:bg-white/10 transition-colors"
        )}
      >
        <Coins className="w-5 h-5 text-yellow-400" />

        <span className="text-sm font-medium text-white">
          {total} <span className="font-bold">CØRE</span>
        </span>

        {open ? (
          <ChevronUp className="w-4 h-4 text-white/50 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/50 ml-1" />
        )}
      </button>

      {/* Expanded inspector */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl z-50">
          <div className="px-4 py-2 text-[11px] uppercase tracking-wider text-white/40">
            Balance by chain
          </div>

          <ul className="divide-y divide-white/5">
            {perChain.map(({ chainId, balance }) => {
              const chain = CHAIN_CONFIG[chainId as ChainId];
              const isActive = chainId === activeChainId;

              return (
                <li
                  key={chainId}
                  className={clsx(
                    "flex items-center justify-between px-4 py-2 text-sm",
                    "transition-colors",
                    isActive
                      ? "bg-white/10 ring-1 ring-white/10"
                      : "hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {chain?.icon && (
                      <img
                        src={chain.icon}
                        alt={chain.name}
                        className="w-4 h-4 rounded-full"
                      />
                    )}
                    <span className="text-white/80 truncate">
                      {chain?.name ?? `Chain ${chainId}`}
                    </span>
                  </div>

                  <span className="font-mono text-white text-right">
                    {balance}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
