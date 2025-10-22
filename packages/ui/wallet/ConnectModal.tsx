"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, X, QrCode } from "lucide-react";
import { useConnect, useDisconnect, useAccount, Connector } from "wagmi";
import { QRStyler } from "./QrStyler";
import { ModalWrapper } from "../profile/components/ModalWrapper";
import TxErrorCard from "../components/ErrorCard";

/* -------------------------------------------------------------------------- */
/* Hook: Detect Mobile                                                        */
/* -------------------------------------------------------------------------- */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
function getWalletName(connector: Connector) {
  if (connector.id === "injected") {
    if ((window as any)?.ethereum?.isBraveWallet) return "Brave Wallet";
    if ((window as any)?.ethereum?.isMetaMask) return "MetaMask";
    return "Browser Wallet";
  }
  if (connector.id === "com.brave.wallet") return "Brave Wallet";
  if (connector.id === "metaMaskSDK") return "MetaMask";
  if (connector.id === "coinbaseWalletSDK") return "Coinbase Wallet";
  return connector.name;
}

function getWalletLogo(connector: Connector) {
  const logos: Record<string, string> = {
    metamask: "/wallets/metamask.svg",
    metaMaskSDK: "/wallets/metamask.svg",
    "io.metamask": "/wallets/metamask.svg",
    brave: "/wallets/brave.svg",
    injected: "/wallets/brave.svg",
    "com.brave.wallet": "/wallets/brave.svg",
    coinbaseWallet: "/wallets/coinbase.svg",
    coinbaseWalletSDK: "/wallets/coinbase.svg",
    walletConnect: "/wallets/walletconnect.svg",
    ledger: "/wallets/ledger.svg",
    safe: "/wallets/safe.svg",
    rainbow: "/wallets/rainbow.svg",
  };
  return logos[connector.id] || "/wallets/default.svg";
}

function isInstalled(c: Connector) {
  if (typeof (c as any).ready === "boolean") return (c as any).ready;
  if (
    c.id === "injected" ||
    c.id === "metamask" ||
    c.id === "metaMaskSDK" ||
    c.id === "com.brave.wallet"
  ) {
    return typeof (window as any)?.ethereum !== "undefined";
  }
  return false;
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

  /* -------------------- Deduplicate Connectors -------------------- */
  const uniqueConnectors = useMemo(() => {
    const seen = new Set<string>();
    return connectors.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [connectors]);

  /* -------------------- Connection Logic -------------------- */
  const handleConnect = useCallback(
    async (connector: Connector) => {
      try {
        setPendingId(connector.id);

        if (connector.id === "walletConnect") {
          const provider: any = await connector.getProvider?.();

          provider.on("display_uri", (uri: string) => {
            if (isMobile) {
              // 🚀 Mobile deep-link
              const encoded = encodeURIComponent(uri);
              const link = `https://walletconnect.com/wc?uri=${encoded}`;

              // Optional: attempt direct MetaMask deep link
              if ((window as any).ethereum?.isMetaMask)
                window.open(`metamask://wc?uri=${encoded}`, "_blank");
              else window.open(link, "_blank");
            } else {
              // 🖥️ Desktop QR flow
              setQrActive(true);
              setQrUri(uri);
            }
          });
        }

        await connectAsync({ connector });
        setPendingId(null);
        onClose();
      } catch (e) {
        console.error("Wallet connect failed", e);
        setPendingId(null);
      }
    },
    [connectAsync, isMobile, onClose]
  );

  useEffect(() => {
    if (isConnected) {
      setPendingId(null);
      onClose();
    }
  }, [isConnected, onClose]);

  if (!open) return null;

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */
  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div
        className={[
          "fixed inset-x-0 bottom-0 z-10 w-full rounded-t-3xl md:static md:mx-auto md:mt-14 md:rounded-3xl md:max-w-4xl",
          "border border-indigo-400/20",
          "bg-gradient-to-br from-zinc-950/95 to-zinc-800/90",
          "shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)]",
          "backdrop-blur-xl",
          "p-5 md:p-8 max-h-[85vh] overflow-y-auto",
        ].join(" ")}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-5 md:mb-8">
          <Image
            src="/Verse-logo.png"
            alt="4lph4Verse"
            width={80}
            height={80}
            className="rounded-lg sm:w-16 sm:h-16 lg:w-28 lg:h-28"
          />
          <div className="text-center">
            <h2 className="font-orbitron text-xl md:text-2xl text-white">
              Connect to the{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                4lph4Verse
              </span>
            </h2>
            <p className="text-gray-400 text-xs md:text-sm">
              Choose your preferred wallet portal
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 🖥️ Desktop View – Keep Column Layout w/ QR                         */}
        {/* ------------------------------------------------------------------ */}
        {!isMobile && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                {uniqueConnectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => handleConnect(connector)}
                    disabled={pendingId === connector.id}
                    className="flex items-center gap-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-gradient-to-r hover:from-indigo-600/20 hover:to-purple-600/20 hover:border-indigo-400/60 transition disabled:opacity-50"
                  >
                    <Image
                      src={getWalletLogo(connector)}
                      alt={connector.name}
                      width={24}
                      height={24}
                      className="rounded-sm"
                    />
                    <span className="flex-1 text-left font-medium">
                      {getWalletName(connector)}
                    </span>
                    {pendingId === connector.id && (
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>

              {error && (
                <div className="mt-4">
                  <TxErrorCard error={error} />
                </div>
              )}
            </div>

            {/* QR column */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 min-h-[280px]">
              {qrActive ? (
                qrUri ? (
                  <>
                    <QRStyler
                      uri={qrUri}
                      logoUrl="/Verse-logo.png"
                      size={260}
                    />
                    <p className="mt-3 text-xs text-gray-300 text-center">
                      Scan with any WalletConnect-compatible wallet
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <Loader2 className="w-5 h-5 animate-spin mb-2" />
                    <p className="text-sm">Generating secure link…</p>
                  </div>
                )
              ) : (
                <>
                  <QrCode className="w-10 h-10 text-indigo-300 mb-3" />
                  <p className="mt-3 text-sm text-gray-300 text-center">
                    Select{" "}
                    <span className="text-white font-medium">
                      WalletConnect
                    </span>{" "}
                    to reveal your portal QR
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 📱 Mobile View – Swipeable Grid                                    */}
        {/* ------------------------------------------------------------------ */}
        {isMobile && (
          <div className="relative overflow-hidden mt-2">
            <motion.div
              drag="x"
              dragConstraints={{
                left:
                  -(
                    (Math.ceil(uniqueConnectors.length / 6) - 1) *
                    window.innerWidth
                  ),
                right: 0,
              }}
              dragElastic={0.1}
              className="flex"
              style={{
                width: `${Math.ceil(uniqueConnectors.length / 6) * 100}%`,
              }}
            >
              {Array.from({
                length: Math.ceil(uniqueConnectors.length / 6),
              }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="w-screen grid grid-cols-3 gap-4 p-4 flex-shrink-0"
                >
                  {uniqueConnectors
                    .slice(pageIndex * 6, pageIndex * 6 + 6)
                    .map((connector) => (
                      <button
                        key={connector.id}
                        onClick={() => handleConnect(connector)}
                        disabled={pendingId === connector.id}
                        className="flex flex-col items-center justify-center gap-2 bg-white/5 rounded-xl border border-white/10 py-4 active:scale-95 transition"
                      >
                        <Image
                          src={getWalletLogo(connector)}
                          alt={connector.name}
                          width={42}
                          height={42}
                          className="rounded-md"
                        />
                        <span className="text-xs text-gray-300 font-medium text-center">
                          {getWalletName(connector)}
                        </span>
                      </button>
                    ))}
                </div>
              ))}
            </motion.div>

            {uniqueConnectors.length > 6 && (
              <div className="text-center text-xs text-gray-400 mt-3">
                Swipe → to see more wallets
              </div>
            )}
          </div>
        )}

        {/* Connected State */}
        {isConnected && (
          <div className="mt-6 space-y-2 text-center">
            <div className="text-sm text-gray-400">
              Connected as{" "}
              <span className="text-white font-mono">
                {address?.slice(0, 6)}…{address?.slice(-4)}
              </span>
            </div>
            <button
              onClick={() => disconnect()}
              className="w-full rounded-lg bg-red-500/80 hover:bg-red-500 px-4 py-2 text-white"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
