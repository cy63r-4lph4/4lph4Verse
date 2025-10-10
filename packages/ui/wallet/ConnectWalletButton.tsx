"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import { useAccount, useDisconnect } from "wagmi";
import { Coins, User2 } from "lucide-react";
import { useBalance } from "@verse/sdk/hooks/useBalance";
import { use, useEffect, useState } from "react";
import WalletDropdown from "./WalletDropdown";
import { useCheckProfile } from "@verse/sdk/hooks/useCheckAccount";
import { useVerseProfile, VerseProfileWizard } from "../profile";
import { VerseConnectModal } from "../wallet/ConnectModal";
import { ExtensionStep } from "../profile/VerseProfileWizard";
import { VerseChainModal } from "../wallet/ChainModal";

export type ConnectWalletButtonProps = {
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  showNetwork?: boolean;
  faucet?: boolean;
  extensions?: ExtensionStep[];
};

export default function ConnectWalletButton({
  className,
  variant = "primary",
  rounded = "md",
  showNetwork = false,
  faucet = false,
  extensions,
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
  const [showChainModal, setShowChainModal] = useState(false);

  const { hasProfile, isLoading, refetch } = useCheckProfile();
  const {
    profile,
    verseID,
    isLoading: profileLoading,
    refetch: refreshProfile,
  } = useVerseProfile(!hasProfile);

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
    await refreshProfile();
  };

  return (
    <div className="flex justify-center relative">
      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openAccountModal, mounted }) => {
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
                    onClick={() => setShowChainModal(true)}
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
                      className="relative flex items-center"
                    >
                      {profileLoading ? (
                        // 🌀 Loading spinner
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : profile?.avatar ? (
                        // 🧩 User avatar
                        <div className="bg-white rounded-full overflow-hidden w-8 h-8">
                          <img
                            src={
                              profile.avatar.startsWith("ipfs://")
                                ? profile.avatar.replace(
                                    "ipfs://",
                                    "https://gateway.pinata.cloud/ipfs/"
                                  )
                                : profile.avatar
                            }
                            alt="User avatar"
                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
                          <User2 className="w-5 h-5 text-white/80" />
                        </div>
                      )}
                    </button>

                    {showNetwork && (
                      <button
                        onClick={() => setShowChainModal(true)}
                        type="button"
                        className="hidden md:inline text-sm text-gray-300 hover:text-white"
                      >
                        {chain.name}
                      </button>
                    )}

                    {menuOpen && (
                      <WalletDropdown
                        account={account}
                        openChainModal={() => setShowChainModal(true)}
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
          extensions={extensions}
        />
      )}
      <VerseChainModal
        open={showChainModal}
        onClose={() => setShowChainModal(false)}
      />

      <VerseConnectModal
        open={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </div>
  );
}
