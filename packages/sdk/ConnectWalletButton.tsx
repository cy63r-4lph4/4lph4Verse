"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";

export type ConnectWalletButtonProps = {
  className?: string; // custom styles
  variant?: "primary" | "secondary" | "ghost"; // theme presets
  rounded?: "none" | "sm" | "md" | "lg" | "full"; // border radius
};

export default function ConnectWalletButton({
  className,
  variant = "primary",
  rounded = "md",
}: ConnectWalletButtonProps) {
  const baseStyles = "px-4 py-2 font-semibold transition-colors";

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

  return (
    <div className="flex justify-center">
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              className={clsx(
                baseStyles,
                variants[variant],
                roundedMap[rounded],
                className
              )}
            >
              {!connected ? (
                <button onClick={openConnectModal} type="button">
                  Connect Wallet
                </button>
              ) : chain.unsupported ? (
                <button onClick={openChainModal} type="button">
                  Wrong network
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                  </button>
                  <button onClick={openChainModal} type="button" className="hidden md:inline">
                    {chain.name}
                  </button>
                </div>
              )}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
