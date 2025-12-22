"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { Loader2, X, QrCode } from "lucide-react";
import { useConnect, useDisconnect, useAccount, Connector } from "wagmi";

import { QRStyler } from "./QrStyler";
import { ModalWrapper } from "../profile/components/ModalWrapper";
import TxErrorCard from "../components/ErrorCard";

import {
  Brave,
  Coinbase,
  Metamask,
  Walletconnect,
  VerseLogo,
} from "@verse/ui/public";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type WalletLogo = StaticImageData | string;

type WalletView = {
  connector: Connector;
  name: string;
  logo: WalletLogo;
  installed: boolean;
  priority: number;
};

/* -------------------------------------------------------------------------- */
/* Wallet Registry (single source of truth)                                   */
/* -------------------------------------------------------------------------- */

const WALLET_REGISTRY: Record<
  string,
  { name: string; logo: WalletLogo; priority: number }
> = {
  injected: {
    name: "Browser Wallet",
    logo: Brave,
    priority: 100,
  },

  "com.brave.wallet": {
    name: "Brave Wallet",
    logo: Brave,
    priority: 1,
  },

  metamask: {
    name: "MetaMask",
    logo: Metamask,
    priority: 1,
  },

  metaMaskSDK: {
    name: "MetaMask",
    logo: Metamask,
    priority: 1,
  },

  coinbaseWalletSDK: {
    name: "Coinbase Wallet",
    logo: Coinbase,
    priority: 2,
  },

  walletConnect: {
    name: "WalletConnect",
    logo: Walletconnect,
    priority: 10,
  },
};

/* -------------------------------------------------------------------------- */
/* Hooks & Runtime Intelligence                                               */
/* -------------------------------------------------------------------------- */

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}

function resolveInjectedName() {
  const eth = (window as any)?.ethereum;
  if (eth?.isBraveWallet) return "Brave Wallet";
  if (eth?.isMetaMask) return "MetaMask";
  return "Browser Wallet";
}

function isInstalled(connector: Connector) {
  if (typeof (connector as any).ready === "boolean")
    return (connector as any).ready;

  if (connector.id === "injected")
    return typeof (window as any)?.ethereum !== "undefined";

  return true;
}

/* -------------------------------------------------------------------------- */
/* Normalize + Sort Connectors                                                */
/* -------------------------------------------------------------------------- */

function normalizeConnectors(connectors: readonly Connector[]) {
  const seen = new Set<string>();

  return connectors
    .filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    })
    .map((connector) => {
      const meta = WALLET_REGISTRY[connector.id];

      const name =
        connector.id === "injected"
          ? resolveInjectedName()
          : meta?.name ?? connector.name;

      return {
        connector,
        name,
        logo: meta?.logo ?? "/wallets/default.svg",
        installed: isInstalled(connector),
        priority: meta?.priority ?? 50,
      };
    })
    .sort((a, b) => {
      if (a.installed !== b.installed) return a.installed ? -1 : 1;
      return a.priority - b.priority;
    });
}

/* -------------------------------------------------------------------------- */
/* Wallet Button                                                              */
/* -------------------------------------------------------------------------- */

function WalletButton({
  wallet,
  onConnect,
  pending,
}: {
  wallet: WalletView;
  onConnect: (c: Connector) => void;
  pending: boolean;
}) {
  return (
    <button
      onClick={() => onConnect(wallet.connector)}
      disabled={!wallet.installed || pending}
      className={[
        "flex items-center gap-3 w-full rounded-xl px-4 py-3 transition",
        "border border-white/10 bg-white/5 text-white",
        wallet.installed
          ? "hover:bg-gradient-to-r hover:from-indigo-600/20 hover:to-purple-600/20 hover:border-indigo-400/60"
          : "opacity-40 cursor-not-allowed",
      ].join(" ")}
    >
      <Image src={wallet.logo} alt={wallet.name} width={24} height={24} />

      <span className="flex-1 text-left font-medium">{wallet.name}</span>

      {!wallet.installed && (
        <span className="text-xs text-gray-400">Not installed</span>
      )}

      {pending && (
        <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

type Props = { open: boolean; onClose: () => void };

export function VerseConnectModal({ open, onClose }: Props) {
  const isMobile = useIsMobile();
  const { connectors, connectAsync, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [qrUri, setQrUri] = useState<string | null>(null);
  const [qrActive, setQrActive] = useState(false);

  const wallets = useMemo(
    () => normalizeConnectors(connectors),
    [connectors]
  );

  const handleConnect = useCallback(
    async (connector: Connector) => {
      try {
        setPendingId(connector.id);

        if (connector.id === "walletConnect") {
          const provider: any = await connector.getProvider?.();
          provider?.on("display_uri", (uri: string) => {
            if (isMobile) {
              window.open(
                `https://walletconnect.com/wc?uri=${encodeURIComponent(uri)}`,
                "_blank"
              );
            } else {
              setQrActive(true);
              setQrUri(uri);
            }
          });
        }

        await connectAsync({ connector });
        onClose();
      } catch (e) {
        console.error("Wallet connect failed", e);
      } finally {
        setPendingId(null);
      }
    },
    [connectAsync, isMobile, onClose]
  );

  if (!open) return null;

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="relative mx-auto max-w-4xl rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-zinc-950/95 to-zinc-800/90 p-6 shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)] backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex flex-col items-center gap-3">
          <Image src={VerseLogo} alt="Verse" width={80} height={80} />
          <h2 className="font-orbitron text-xl text-white">
            Connect to the{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              4lph4Verse
            </span>
          </h2>
          <p className="text-sm text-gray-400">
            Choose your preferred wallet portal
          </p>
        </div>

        {!isMobile && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <WalletButton
                  key={wallet.connector.id}
                  wallet={wallet}
                  pending={pendingId === wallet.connector.id}
                  onConnect={handleConnect}
                />
              ))}

              {error && <TxErrorCard error={error} />}
            </div>

            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6">
              {qrActive && qrUri ? (
                <QRStyler uri={qrUri} logoUrl="/Verse-logo.png" size={260} />
              ) : (
                <QrCode className="h-10 w-10 text-indigo-300" />
              )}
            </div>
          </div>
        )}

        {isConnected && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Connected as{" "}
              <span className="font-mono text-white">
                {address?.slice(0, 6)}…{address?.slice(-4)}
              </span>
            </p>

            <button
              onClick={() => disconnect()}
              className="mt-3 w-full rounded-lg bg-red-500/80 px-4 py-2 text-white hover:bg-red-500"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
