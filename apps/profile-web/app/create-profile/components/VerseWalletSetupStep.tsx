"use client";

/**
 * VerseWalletSetupStep — Passkey Registration + Wallet Initialization UI
 *
 * Displayed as the second step of profile creation after the backend
 * profile record is created. Shows a cyberpunk HUD panel guiding
 * the user through:
 *   1. Biometric passkey registration prompt
 *   2. Cross-chain address computation progress
 *   3. Final wallet address reveal with copy support
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fingerprint,
  ShieldCheck,
  Loader2,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Globe,
} from "lucide-react";
import type { ChainAddress, Progress } from "../../../hooks/useV6ProfileWizard";

// ─── Chain logos / colors ────────────────────────────────────────────────────

const CHAIN_META: Record<number, { name: string; color: string; symbol: string }> = {
  42220:  { name: "Celo",           color: "#FCFF52", symbol: "CELO" },
  44787:  { name: "Celo Alfajores", color: "#FCFF52", symbol: "CELO" },
  84532:  { name: "Base Sepolia",   color: "#0052FF", symbol: "ETH"  },
  4202:   { name: "Lisk Sepolia",   color: "#4070F4", symbol: "ETH"  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CornerMarkers({ color = "alpha-cyan" }: { color?: string }) {
  const cls = `border-${color}`;
  return (
    <>
      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${cls}`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${cls}`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${cls}`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${cls}`} />
    </>
  );
}

function ScanlineEffect() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.3) 2px, rgba(0,240,255,0.3) 4px)",
      }}
    />
  );
}

function AddressRow({ account }: { account: ChainAddress }) {
  const [copied, setCopied] = useState(false);
  const meta = CHAIN_META[account.chainId];

  const copy = () => {
    navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddr = `${account.address.slice(0, 8)}...${account.address.slice(-6)}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between gap-3 p-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
    >
      {/* Chain indicator */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
          style={{ backgroundColor: meta?.color ?? "#00f0ff" }}
        />
        <span className="font-mono text-xs text-slate-400 uppercase tracking-widest flex-shrink-0">
          {meta?.name ?? `Chain ${account.chainId}`}
        </span>
        <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
        <span className="font-mono text-xs text-alpha-cyan truncate">
          {shortAddr}
        </span>
      </div>

      {/* Copy button */}
      <button
        onClick={copy}
        className="flex-shrink-0 p-1.5 border border-white/10 hover:border-alpha-cyan/50 hover:bg-alpha-cyan/10 transition-all text-slate-500 hover:text-alpha-cyan"
        title="Copy full address"
      >
        {copied ? (
          <Check className="w-3 h-3 text-alpha-cyan" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
    </motion.div>
  );
}

// ─── Step States ──────────────────────────────────────────────────────────────

interface StepIndicatorProps {
  step: number;
  label: string;
  status: "pending" | "active" | "done";
}

function StepIndicator({ step, label, status }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 text-xs font-mono font-bold flex items-center justify-center border transition-all duration-500 ${
          status === "done"
            ? "border-alpha-cyan bg-alpha-cyan/20 text-alpha-cyan"
            : status === "active"
            ? "border-alpha-cyan text-alpha-cyan animate-pulse bg-alpha-cyan/10"
            : "border-white/10 text-slate-600"
        }`}
      >
        {status === "done" ? <Check className="w-3 h-3" /> : step}
      </div>
      <span
        className={`font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${
          status === "active"
            ? "text-alpha-cyan"
            : status === "done"
            ? "text-slate-400"
            : "text-slate-600"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface VerseWalletSetupStepProps {
  progress: Progress;
  error: string | null;
  walletAddresses: ChainAddress[];
  onInitiate: () => void;
  submitting: boolean;
}

export function VerseWalletSetupStep({
  progress,
  error,
  walletAddresses,
  onInitiate,
  submitting,
}: VerseWalletSetupStepProps) {
  const isDone = progress === "done";
  const isActive = submitting || progress !== "idle";
  const isError = progress === "error";

  const stepStatus = (targetStep: Progress): "pending" | "active" | "done" => {
    const order: Progress[] = [
      "creating-profile",
      "registering-passkey",
      "creating-wallet",
      "computing-address",
      "minting-nft",
      "done",
    ];
    const currentIdx = order.indexOf(progress);
    const targetIdx = order.indexOf(targetStep);
    if (currentIdx > targetIdx) return "done";
    if (currentIdx === targetIdx) return "active";
    return "pending";
  };

  return (
    <div className="relative p-6 hud-panel border border-alpha-cyan/30 bg-black/60 overflow-hidden">
      <ScanlineEffect />
      <CornerMarkers />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-alpha-cyan/10">
        <div className="relative">
          <div className="absolute inset-0 blur-md bg-alpha-cyan/30 rounded-full" />
          <Zap className="relative w-5 h-5 text-alpha-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        </div>
        <div>
          <h3 className="font-mono text-sm uppercase tracking-widest font-bold text-alpha-cyan text-glow">
            Verse Smart Wallet
          </h3>
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
            Passkey-secured · Cross-chain · ERC-4337
          </p>
        </div>
      </div>

      {/* Idle state — explain and prompt */}
      <AnimatePresence mode="wait">
        {progress === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            {/* Security properties */}
            <div className="space-y-2">
              {[
                { icon: Fingerprint, text: "Private key lives in your device's Secure Enclave (Face ID / Touch ID / PIN)" },
                { icon: ShieldCheck, text: "Never leaves your hardware — not even to 4lph4verse servers" },
                { icon: Globe, text: "Same address on Celo, Base, Lisk, and every future chain" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3 text-xs font-mono text-slate-400">
                  <Icon className="w-3.5 h-3.5 text-alpha-cyan flex-shrink-0 mt-0.5 drop-shadow-[0_0_4px_rgba(0,240,255,0.5)]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div className="border-l-2 border-alpha-magenta bg-alpha-magenta/5 px-3 py-2">
              <p className="font-mono text-[10px] text-alpha-magenta uppercase tracking-widest font-bold mb-1">
                SYS.WARN: No seed phrase
              </p>
              <p className="font-mono text-[10px] text-slate-400">
                Your wallet is secured by biometrics, not a mnemonic.
                No phrase to write down — and no phrase to lose.
              </p>
            </div>

            {/* Initiate button */}
            <button
              onClick={onInitiate}
              className="w-full py-4 font-mono text-sm uppercase tracking-widest font-bold border border-alpha-cyan text-alpha-cyan bg-alpha-cyan/10 hover:bg-alpha-cyan/25 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4" />
              [ Register Passkey + Create Wallet ]
            </button>

            <p className="text-center font-mono text-[9px] text-slate-600 uppercase tracking-widest">
              Your browser will prompt for biometric verification
            </p>
          </motion.div>
        )}

        {/* Active / progress state */}
        {isActive && !isDone && !isError && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            {/* Progress steps */}
            <div className="space-y-3">
              <StepIndicator
                step={1}
                label="Profile record"
                status={stepStatus("creating-profile")}
              />
              <StepIndicator
                step={2}
                label="Passkey registration"
                status={stepStatus("registering-passkey")}
              />
              <StepIndicator
                step={3}
                label="Wallet identity"
                status={stepStatus("creating-wallet")}
              />
              <StepIndicator
                step={4}
                label="Cross-chain addresses"
                status={stepStatus("computing-address")}
              />
              <StepIndicator
                step={5}
                label="Mint identity NFT"
                status={stepStatus("minting-nft")}
              />
            </div>

            {/* Current step detail */}
            <div className="p-3 border border-alpha-cyan/20 bg-alpha-cyan/5">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-alpha-cyan animate-spin" />
                <span className="font-mono text-xs text-alpha-cyan uppercase tracking-widest">
                  {progress === "creating-profile"   && "Creating profile record..."}
                  {progress === "registering-passkey" && "Waiting for biometric approval..."}
                  {progress === "creating-wallet"    && "Generating wallet identity..."}
                  {progress === "computing-address"  && "Computing cross-chain addresses..."}
                  {progress === "minting-nft"        && "Minting identity NFT on-chain..."}
                </span>
              </div>
              {progress === "registering-passkey" && (
                <p className="mt-2 font-mono text-[10px] text-slate-500">
                  {">"} Please complete the biometric prompt on your device.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {isError && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="p-4 border border-red-500/50 bg-red-950/20">
              <p className="font-mono text-xs text-red-400 uppercase tracking-widest font-bold mb-1">
                SYS.ERR: Initialization failed
              </p>
              <p className="font-mono text-[10px] text-slate-400">
                {error ?? "An unexpected error occurred."}
              </p>
            </div>
            <button
              onClick={onInitiate}
              className="w-full py-3 font-mono text-xs uppercase tracking-widest border border-red-500/50 text-red-400 bg-red-950/20 hover:bg-red-500/20 transition-all"
            >
              [ Retry ]
            </button>
          </motion.div>
        )}

        {/* Success state — show addresses */}
        {isDone && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Success header */}
            <div className="flex items-center gap-3 p-3 border border-alpha-cyan/30 bg-alpha-cyan/5">
              <ShieldCheck className="w-5 h-5 text-alpha-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
              <div>
                <p className="font-mono text-xs text-alpha-cyan uppercase tracking-widest font-bold text-glow">
                  Wallet initialized
                </p>
                <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                  Passkey registered · Addresses computed
                </p>
              </div>
            </div>

            {/* Cross-chain addresses */}
            {walletAddresses.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-3 h-3 text-slate-500" />
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                    Your universal address
                  </span>
                </div>
                {walletAddresses.map((acc) => (
                  <AddressRow key={acc.chainId} account={acc} />
                ))}
                <p className="font-mono text-[9px] text-slate-600 mt-2 text-center uppercase tracking-widest">
                  Same address on every chain · Activated on first use
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
