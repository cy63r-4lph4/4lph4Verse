"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { Coins, User2, Copy, LogOut } from "lucide-react";
import { useBalance } from "./hooks/useBalance";
import { useState } from "react";
import WalletDropdown from "./WalletDropdown";

export type ConnectWalletButtonProps = {
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  showNetwork?: boolean;
  faucet?: boolean;
};

export default function ConnectWalletButton({
  className,
  variant = "primary",
  rounded = "md",
  showNetwork = false,
  faucet = false,
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
        {({
          account,
          chain,
          openChainModal,
          openConnectModal,
          openAccountModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div className="flex items-center gap-4">
              {/* 🪙 Core Token Balance */}
              
              {!faucet &&connected && address && balance !== undefined && (
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
                      {faucet ? (
                        <div className="flex items-center gap-3">
                          <button onClick={openAccountModal} type="button">
                            {account.displayName}
                          </button>
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="hidden md:inline"
                          >
                            {chain.name}
                          </button>
                        </div>
                      ) : (
                        <User2 className="md:block w-5 h-5 text-white" />
                      )}
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
                    {!faucet && menuOpen && (
                      <WalletDropdown
                        account={account}
                        openChainModal={openChainModal}
                        menuOpen={menuOpen}
                        setMenuOpen={setMenuOpen}
                      />
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
