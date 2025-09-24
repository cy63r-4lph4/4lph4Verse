"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { Coins, User2, Copy, LogOut } from "lucide-react";
import { useBalance } from "./hooks/useBalance";
import { useState } from "react";

export type ConnectWalletButtonProps = {
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  showNetwork?: boolean;
};

export default function ConnectWalletButton({
  className,
  variant = "primary",
  rounded = "md",
  showNetwork = false,
}: ConnectWalletButtonProps) {
  const baseStyles =
    "px-4 py-2 font-semibold transition-colors flex items-center gap-3";

  const variants: Record<string, string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-100 text-indigo-600 hover:text-white hover:bg-white/10",
    ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50",
  };

  const roundedMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const { address } = useAccount();
  const { balance } = useBalance();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex justify-center relative">
      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, mounted }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div className="flex items-center gap-4">
              {/* 🪙 Core Token Balance */}
              {connected && address && balance !== undefined && (
                <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-white">
                    {balance} <span className="core-token">CØRE</span>
                  </span>
                </div>
              )}

              <div
                className={clsx(
                  !connected && !chain?.unsupported && baseStyles,
                  !connected && !chain?.unsupported && variants[variant],
                  !connected && !chain?.unsupported && roundedMap[rounded],
                  className
                )}
              >
                {!connected ? (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                ) : chain.unsupported ? (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className={
                      baseStyles + " bg-red-600 text-white hover:bg-red-700"
                    }
                  >
                    Wrong network
                  </button>
                ) : (
                  <div className="flex items-center gap-3 relative">
                    {/* 👤 Account button toggles custom menu */}
                    <button
                      onClick={() => setMenuOpen((o) => !o)}
                      type="button"
                    >
                      <User2 className="md:block w-5 h-5 text-white" />
                    </button>

                    {/* 🌐 Optional network name */}
                    {showNetwork && (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="hidden md:inline"
                      >
                        {chain.name}
                      </button>
                    )}

                    {/* 🔽 Custom dropdown menu */}
                    {menuOpen && (
                      <div className="absolute top-12 right-0 w-64 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl bg-zinc-900/80 z-50 p-4">
                        {/* Wallet Address */}
                        <div className="mb-3">
                          <p className="text-xs font-mono break-words text-gray-400">
                            {account?.address}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          {/* Copy Address */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                account?.address || ""
                              );
                              setMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-400 transition"
                          >
                            <Copy className="w-4 h-4 text-indigo-400" />
                            Copy Address
                          </button>

                          {/* Switch Network */}
                          <button
                            onClick={openChainModal}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-yellow-500/20 hover:text-yellow-400 transition"
                          >
                            <Coins className="w-4 h-4 text-yellow-400" />
                            Switch Network
                          </button>

                          {/* Faucet Link */}
                          <a
                            href="https://4lph4-verse-verse-core.vercel.app/faucet"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-emerald-500/20 hover:text-emerald-400 transition"
                          >
                            <Coins className="w-4 h-4 text-emerald-400" />
                            Claim Faucet
                          </a>

                          {/* Disconnect */}
                          <button
                            onClick={() => {
                              // TODO: Replace with wagmi.disconnect() for real wallet disconnect
                              localStorage.clear();
                              window.location.reload();
                            }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-red-500/20 hover:text-red-400 transition"
                          >
                            <LogOut className="w-4 h-4 text-red-400" />
                            Disconnect
                          </button>
                        </div>
                      </div>
                    )}

                    
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
