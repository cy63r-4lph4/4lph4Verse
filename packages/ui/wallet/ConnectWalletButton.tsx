"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import { useAccount, useDisconnect } from "wagmi";
import { Coins, User2 } from "lucide-react";
import { useBalance } from "@verse/sdk/hooks/useBalance";
import { useEffect, useState } from "react";
import WalletDropdown from "./WalletDropdown";
import { useCheckProfile } from "@verse/sdk/hooks/useCheckAccount";
import { VerseProfileWizard } from "../profile";
import { VerseConnectModal } from "../wallet/ConnectModal";

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

  const { hasProfile, isLoading, refetch } = useCheckProfile();

  const [showModal, setShowModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const { disconnect } = useDisconnect();

  const handleCloseModal = () => {
    if (!success || !hasProfile) {
      disconnect();
    }
    setShowModal(false);
  };

  const handleProfileCreated = async () => {
    setSuccess(true);
    setShowModal(false);
    await refetch();
  };

  return (
    <div className="flex justify-center relative">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openChainModal,
          openAccountModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          useEffect(() => {
            if (connected && !isLoading && !hasProfile && !success) {
              setShowModal(true);
            }
          }, [connected, isLoading, hasProfile, success]);

          return (
            <div className="flex items-center gap-4">
              {/* 🪙 Core Token Balance */}
              {!faucet && connected && address && balance !== undefined && (
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
                  <button
                    onClick={() => {
                      setShowConnectModal(true); // ✅ custom modal
                    }}
                    type="button"
                  >
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
                ) : faucet ? (
                  // ✅ Faucet page: show direct RainbowKit buttons, no wrapper button
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
                  // ✅ Normal pages: dropdown toggle
                  <div className="flex items-center gap-3 relative">
                    <button
                      onClick={() => setMenuOpen((o) => !o)}
                      type="button"
                    >
                      <User2 className="md:block w-5 h-5 text-white" />
                    </button>

                    {showNetwork && (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="hidden md:inline"
                      >
                        {chain.name}
                      </button>
                    )}

                    {menuOpen && (
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

      {showModal && !faucet && (
        <VerseProfileWizard
          asModal
          onClose={handleCloseModal}
          onComplete={handleProfileCreated}
          extensions={[
            {
              id: "hirecore",
              title: "HireCore Setup",
              description: "Tell us how you want to use HireCore",
              fields: [
                {
                  type: "select",
                  name: "role",
                  label: "Role",
                  options: ["Worker", "Client"],
                  required: true,
                },
                {
                  type: "tags",
                  name: "skills",
                  label: "Skills / Interests",
                  placeholder: "e.g. Electrician, Plumber",
                },
              ],
            },
          ]}
        />
      )}

      <VerseConnectModal
        open={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </div>
  );
}
