"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import clsx from "clsx";
import { Coins, User2 } from "lucide-react";

import { useBalance } from "@verse/sdk";
import { useCheckProfile } from "@verse/sdk";
import { useVerseProfile } from "@verse/sdk/src/hooks/useVerseProfile";

import WalletDropdown from "./WalletDropdown";
import { VerseProfileWizardV2 } from "../profile/VerseProfileWizardV2";
import { VerseConnectModal } from "../wallet/ConnectModal";
import { VerseChainModal } from "../wallet/ChainModal";

/* --------------------------- Types & Props --------------------------- */
export type PersonaField = {
  name: string;
  label?: string;
  placeholder?: string;
};

export type WalletContext = {
  account: any | null;
  chain: any | null;
  address?: string | undefined;
  balance?: string | number | undefined;
  profile?: any | null;
  loadingProfile?: boolean;
  openChainModal: () => void;
  disconnect: () => void;
};

export type VerseConnectButtonProps = {
  className?: string;
  style?: React.CSSProperties;
  variant?: "solid" | "outline" | "glass" | "ghost" | "custom";
  size?: "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  glow?: "cyan" | "blue" | "pink" | "none";

  /* Feature toggles */
  showBalance?: boolean;
  showNetwork?: boolean;
  showAvatar?: boolean;
  showDropdown?: boolean;
  showWizard?: boolean;

  /* Layout / Render Override Points */
  renderDisconnected?: (open: () => void) => React.ReactNode;
  renderConnected?: (ctx: WalletContext) => React.ReactNode;
  renderAvatar?: (ctx: WalletContext) => React.ReactNode;
  renderBalance?: (ctx: WalletContext) => React.ReactNode;

  /* Replaceable UI components (use these to fully white-label) */
  ConnectModalComponent?: React.ComponentType<any>;
  ChainModalComponent?: React.ComponentType<any>;
  WizardComponent?: React.ComponentType<any>;
  DropdownComponent?: React.ComponentType<any>;

  /* Wizard / profile */
  personaFields?: PersonaField[];
  dapp?: string;

  /* Events */
  onConnect?: () => void;
  onDisconnect?: () => void;
  onWizardComplete?: () => void;
  onMissingProfile?: () => void;
};

/* -------------------------- Default style system -------------------------- */
const SIZE_MAP: Record<string, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};
const ROUND_MAP: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};
const VARIANT_MAP: Record<string, string> = {
  solid: "bg-indigo-600 text-white hover:bg-indigo-700",
  outline:
    "bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white",
  glass:
    "bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/10",
  ghost: "bg-transparent hover:bg-indigo-50 text-indigo-600",
  custom: "",
};

/* -------------------------- Helper small components -------------------------- */
function DefaultBalance({ balance }: { balance?: string | number }) {
  return (
    <div className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
      <Coins className="w-5 h-5 text-yellow-400" />
      <span className="text-sm font-medium">
        {balance ?? "—"} <span className="font-bold">CØRE</span>
      </span>
    </div>
  );
}

function DefaultAvatar({ profile }: { profile?: any }) {
  if (profile?.avatar) {
    const src = profile.avatar.startsWith("ipfs://")
      ? profile.avatar.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
      : profile.avatar;
    return (
      <div className="bg-white rounded-full overflow-hidden w-8 h-8">
        <img src={src} alt="avatar" className="w-8 h-8 object-cover" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
      <User2 className="w-5 h-5 text-white/80" />
    </div>
  );
}

/* --------------------------- The Component --------------------------- */
export default function VerseConnectButton({
  className,
  style,
  variant = "solid",
  size = "md",
  rounded = "md",

  showBalance = true,
  showNetwork = false,
  showAvatar = true,
  showDropdown = true,
  showWizard = true,

  renderDisconnected,
  renderConnected,
  renderAvatar,
  renderBalance,

  ConnectModalComponent = VerseConnectModal,
  ChainModalComponent = VerseChainModal,
  WizardComponent = VerseProfileWizardV2,
  DropdownComponent = WalletDropdown,

  personaFields = [],
  dapp,

  onConnect,
  onDisconnect,
  onWizardComplete,
  onMissingProfile,
}: VerseConnectButtonProps) {
  /* Wallet & Verse hooks */
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { balance } = useBalance();

  const { hasProfile, isLoading: checkingProfile, refetch } = useCheckProfile();
  const {
    profile,
    isLoading: loadingProfile,
    refetch: refetchProfile,
  } = useVerseProfile(hasProfile);

  /* Local UI State */
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChainModal, setShowChainModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showWizardState, setShowWizardState] = useState(false);
  const [wizardDone, setWizardDone] = useState(false);

  /* Auto-open wizard when conditions are met */
  useEffect(() => {
    const shouldOpenWizard =
      address && !checkingProfile && !hasProfile && !wizardDone && showWizard;
    if (shouldOpenWizard) setShowWizardState(true);
    else if (onMissingProfile && address) {
      console.log(address);
      onMissingProfile();
      return;
    }
  }, [address, checkingProfile, hasProfile, wizardDone, showWizard]);

  async function handleWizardComplete() {
    setWizardDone(true);
    setShowWizardState(false);
    await refetch();
    await refetchProfile();
    onWizardComplete?.();
  }

  function handleWizardClose() {
    if (!wizardDone || !hasProfile) disconnect();
    setShowWizardState(false);
  }

  /* classNames derived from props */
  const buttonClasses = useMemo(() => {
    return clsx(
      "flex items-center gap-3 font-semibold transition-colors",
      SIZE_MAP[size],
      VARIANT_MAP[variant],
      ROUND_MAP[rounded],
      className
    );
  }, [size, variant, rounded, className]);

  /* Context object passed into render override callbacks */
  const ctx: WalletContext = {
    account: null,
    chain: null,
    address,
    balance,
    profile,
    loadingProfile,
    openChainModal: () => setShowChainModal(true),
    disconnect: () => {
      disconnect();
      onDisconnect?.();
    },
  };

  /* --------------------------- Render --------------------------- */
  return (
    <div className="relative flex items-center" style={style}>
      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openAccountModal, mounted }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          // update ctx with dynamic values
          ctx.account = account ?? null;
          ctx.chain = chain ?? null;

          return (
            <div className="flex items-center gap-4">
              {/* Balance */}
              {showBalance && connected && address && balance !== undefined && (
                <>
                  {renderBalance ? (
                    renderBalance(ctx)
                  ) : (
                    <DefaultBalance balance={balance} />
                  )}
                </>
              )}

              {/* Main connect button area */}
              <div
                className={clsx(
                  !connected && !chain?.unsupported && buttonClasses
                )}
              >
                {!connected ? (
                  // Disconnected state
                  renderDisconnected ? (
                    renderDisconnected(() => setShowConnectModal(true))
                  ) : (
                    <button
                      onClick={() => setShowConnectModal(true)}
                      type="button"
                    >
                      Connect Wallet
                    </button>
                  )
                ) : chain?.unsupported ? (
                  // Wrong network
                  <button
                    onClick={() => setShowChainModal(true)}
                    type="button"
                    className={
                      buttonClasses + " bg-red-600 text-white hover:bg-red-700"
                    }
                  >
                    Wrong network
                  </button>
                ) : // Connected state
                renderConnected ? (
                  renderConnected(ctx)
                ) : (
                  <div className="flex items-center gap-3 relative">
                    <button
                      onClick={() => setMenuOpen((o) => !o)}
                      type="button"
                      className="relative flex items-center gap-3"
                    >
                      {/* Avatar or spinner */}
                      {loadingProfile ? (
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : renderAvatar ? (
                        renderAvatar(ctx)
                      ) : (
                        showAvatar && <DefaultAvatar profile={profile} />
                      )}

                      {/* small address hint for md+ */}
                      <span className="hidden md:inline text-sm text-gray-300">
                        {account?.displayName ?? account?.address}
                      </span>
                    </button>

                    {/* Network name button */}
                    {showNetwork && (
                      <button
                        onClick={() => setShowChainModal(true)}
                        type="button"
                        className="hidden md:inline text-sm text-gray-300 hover:text-white"
                      >
                        {chain?.name}
                      </button>
                    )}

                    {/* Dropdown */}
                    {menuOpen && showDropdown && (
                      <div className="absolute right-0 mt-12 z-50">
                        {DropdownComponent ? (
                          <DropdownComponent
                            account={account}
                            openChainModal={() => setShowChainModal(true)}
                            menuOpen={menuOpen}
                            setMenuOpen={setMenuOpen}
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </ConnectButton.Custom>

      {/* Modals (replaceable) */}
      {WizardComponent && (
        <WizardComponent
          open={showWizardState}
          onClose={handleWizardClose}
          dapp={dapp}
          personaFields={personaFields}
          onComplete={handleWizardComplete}
        />
      )}

      {ChainModalComponent && (
        <ChainModalComponent
          open={showChainModal}
          onClose={() => setShowChainModal(false)}
        />
      )}

      {ConnectModalComponent && (
        <ConnectModalComponent
          open={showConnectModal}
          onClose={() => setShowConnectModal(false)}
        />
      )}
    </div>
  );
}

/* --------------------------- End of file --------------------------- */
