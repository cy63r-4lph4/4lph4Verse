"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  useAccount,
  useChainId,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import type { Abi } from "viem";
import { deployedContracts } from "@verse/sdk/utils/contract/deployedContracts";
import ConnectWalletButton from "@verse/ui/wallet/ConnectWalletButton";
import { TimeUtils } from "@verse/sdk/utils/time/timeUtils";
import TxErrorCard from "@verse/ui/components/ErrorCard";

// --- helper types + fns --------------------------------------------------

type Eip1193Provider = {
  request: (args: {
    method: string;
    params?: unknown[] | Record<string, unknown>;
  }) => Promise<unknown>;
};

function hasFn(abi: Abi | undefined, name: string) {
  return !!abi?.some((e) => e.type === "function" && e.name === name);
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

// --- component -----------------------------------------------------------

export default function FaucetPageMythicCosmic() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState("");

  // Resolve from SDK (keeps parity with your existing logic)
  const contracts = useMemo(
    () =>
      (deployedContracts as Record<string, unknown>)?.[String(chainId)] as
        | {
            CoreToken?: { address: string; abi: Abi };
            CoreFaucet?: { address: string; abi: Abi };
          }
        | undefined,
    [chainId]
  );
  const coreToken = contracts?.CoreToken;
  const coreFaucet = contracts?.CoreFaucet;

  const faucetAbi = useMemo(
    () => (coreFaucet?.abi ?? []) as Abi,
    [coreFaucet?.abi]
  );
  const tokenAbi = useMemo(
    () => (coreToken?.abi ?? []) as Abi,
    [coreToken?.abi]
  );

  const lastClaimFn = useMemo(() => {
    if (hasFn(faucetAbi, "lastClaimTimestamp")) return "lastClaimTimestamp";
    if (hasFn(faucetAbi, "lastClaim")) return "lastClaim";
    return undefined;
  }, [faucetAbi]);

  const cooldownFn = useMemo(() => {
    if (hasFn(faucetAbi, "cooldownSeconds")) return "cooldownSeconds";
    if (hasFn(faucetAbi, "cooldown")) return "cooldown";
    return undefined;
  }, [faucetAbi]);

  const hasSymbol = useMemo(() => hasFn(tokenAbi, "symbol"), [tokenAbi]);

  const { data: tokenSymbol } = useReadContract({
    address:
      mounted && coreToken?.address && hasSymbol
        ? (coreToken.address as `0x${string}`)
        : undefined,
    abi: tokenAbi,
    functionName: "symbol",
    query: { enabled: mounted && Boolean(coreToken?.address && hasSymbol) },
  });

  const { data: lastClaim } = useReadContract({
    address:
      mounted && coreFaucet?.address && lastClaimFn
        ? (coreFaucet.address as `0x${string}`)
        : undefined,
    abi: faucetAbi,
    functionName: lastClaimFn,
    args: mounted && address && lastClaimFn ? [address] : undefined,
    query: {
      enabled:
        mounted && Boolean(address && coreFaucet?.address && lastClaimFn),
      refetchInterval: 5000,
    },
  });

  const { data: cooldown } = useReadContract({
    address:
      mounted && coreFaucet?.address && cooldownFn
        ? (coreFaucet.address as `0x${string}`)
        : undefined,
    abi: faucetAbi,
    functionName: cooldownFn,
    query: {
      enabled: mounted && Boolean(coreFaucet?.address && cooldownFn),
      refetchInterval: 60000,
    },
  });

  // Live countdown
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    if (
      !mounted ||
      typeof lastClaim === "undefined" ||
      typeof cooldown === "undefined"
    ) {
      setRemaining(null);
      return;
    }
    const update = () => {
      const next = Number(lastClaim) + Number(cooldown);
      const diff = next - Math.floor(Date.now() / 1000);
      setRemaining(diff > 0 ? diff : 0);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [mounted, lastClaim, cooldown]);

  // Write + receipt
  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const handleClaim = () => {
    if (!coreFaucet?.address) return;
    if (!remaining !== null && remaining !== 0) return;
    setStatus("");
    try {
      writeContract({
        address: coreFaucet.address as `0x${string}`,
        abi: faucetAbi,
        functionName: "claim",
      });
    } catch (err: unknown) {
      setStatus(isErrorWithMessage(err) ? err.message : "Transaction failed");
    }
  };

  const addToken = async () => {
    if (!mounted || !coreToken) return;
    const provider: Eip1193Provider | undefined = (
      window as unknown as { ethereum?: Eip1193Provider }
    ).ethereum;
    if (!provider) return;

    try {
      await provider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: coreToken.address,
            symbol: (tokenSymbol as string) || "CORE",
            decimals: 18,
          },
        },
      });
    } catch {
      setStatus("Failed to add token");
    }
  };

  const readsReady = remaining !== null;
  const canClaim = readsReady && remaining === 0 && !isPending && !isConfirming;

  // animation controls
  const controls = useAnimation();
  useEffect(() => {
    if (isPending || isConfirming) controls.start({ scale: [1, 0.98, 1] });
    else controls.start({ scale: 1 });
  }, [isPending, isConfirming, controls]);

  // progress ring percentage (0..1)
  const cooldownNumber = cooldown ? Number(cooldown) : null;
  const progress =
    remaining === null || !cooldownNumber
      ? 1
      : Math.max(0, 1 - remaining / cooldownNumber);

  // time label
  const timeLabel = !readsReady
    ? "—"
    : remaining && remaining > 0
      ? `Next claim in ${TimeUtils.formatRemaining(remaining)}`
      : "Ready to claim";

  // --- visual component -------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#030318] via-[#081229] to-[#04040a] overflow-hidden">
      {/* subtle starfield using CSS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full animate-tilt opacity-60" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <div className="rounded-3xl p-8 bg-gradient-to-br from-white/5 to-white/3 border border-white/5 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-200">
              Claim from the Cosmic Rift
            </h1>
            <p className="max-w-xl text-sm text-slate-300">
              Invoke the 4lph4 CØRE — a mythic conduit of energy. Once the rift
              stabilizes you may harvest tokens. The ritual hums in the
              background.
            </p>

            {/* CRYSTAL + RING */}
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              {/* subtle floating shadow */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {/* progress ring (svg) */}
                <svg
                  className="w-56 h-56 md:w-72 md:h-72"
                  viewBox="0 0 120 120"
                >
                  <defs>
                    <linearGradient id="g1" x1="0%" x2="100%">
                      <stop offset="0%" stopColor="#8be9fd" />
                      <stop offset="50%" stopColor="#7c4dff" />
                      <stop offset="100%" stopColor="#ffd166" />
                    </linearGradient>
                  </defs>

                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="8"
                    fill="none"
                  />

                  <motion.circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="url(#g1)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={Math.PI * 2 * 48}
                    animate={{
                      strokeDashoffset: (1 - progress) * Math.PI * 2 * 48,
                    }}
                    transition={{ duration: 0.7 }}
                    style={{ rotate: -90 }}
                  />
                </svg>

                {/* crystalline core */}
                <motion.div
                  className="absolute w-28 h-28 md:w-36 md:h-36 flex items-center justify-center"
                  initial={{ scale: 0.96 }}
                  animate={{ rotate: [0, 6, 0, -6, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-60 bg-gradient-to-tr from-[#5eead4]/50 via-[#7c4dff]/40 to-[#ffd166]/35" />
                    <svg
                      viewBox="0 0 100 100"
                      className="relative z-10 w-full h-full"
                    >
                      <g transform="translate(50,50)">
                        <polygon
                          points="0,-30 18,-10 11,24 -11,24 -18,-10"
                          fill="#a78bfa"
                          opacity="0.95"
                        />
                        <polygon
                          points="0,30 -18,10 -11,-24 11,-24 18,10"
                          fill="#7dd3fc"
                          opacity="0.85"
                        />
                      </g>
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* controls */}
            <div className="w-full flex flex-col sm:flex-row gap-4 mt-2">
              <motion.button
                className="flex-1 py-4 rounded-2xl font-extrabold text-lg shadow-2xl bg-gradient-to-r from-purple-600 to-cyan-400 hover:scale-102 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={handleClaim}
                disabled={!canClaim}
                animate={controls}
                whileTap={{ scale: 0.98 }}
              >
                {!readsReady
                  ? "Aligning the rift…"
                  : isPending
                    ? "Confirm in wallet…"
                    : isConfirming
                      ? "Claiming…"
                      : remaining! > 0
                        ? `Harvest in ${TimeUtils.formatRemaining(remaining!)}`
                        : "Claim CØRE — Harvest the Rift"}
              </motion.button>

              <button
                onClick={addToken}
                className="w-full sm:w-44 py-3 rounded-2xl font-semibold border border-white/10 bg-black/30"
              >
                Add CØRE
              </button>
            </div>
            <ConnectWalletButton faucet={true} rounded="full" />
            {/* feedback & errors */}
            <div className="w-full">
              {(!lastClaimFn || !cooldownFn) && (
                <p className="text-amber-300 text-sm">
                  Heads up: faucet ABI missing expected getters; UI will skip
                  cooldown gating.
                </p>
              )}

              {writeError && (
                <TxErrorCard error={writeError} onRetry={handleClaim} />
              )}
              {isReceiptError && (
                <TxErrorCard
                  error={
                    receiptError ||
                    new Error(
                      "Transaction reverted. Likely cooldown still active."
                    )
                  }
                />
              )}

              {isSuccess && (
                <p className="mt-2 text-center text-green-400 text-sm">
                  ENERGY TRANSFER COMPLETE ⚡
                </p>
              )}

              {status && !writeError && !isReceiptError && (
                <p className="mt-2 text-center text-cyan-300 text-sm">
                  {status}
                </p>
              )}

              <p className="mt-3 text-center text-xss text-slate-400">
                {timeLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Tip: For best effect enable reduced motion in your system settings to
          disable fancy animations.
        </div>
      </div>

      {/* decorative corners */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-8 top-12 w-48 h-48 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-purple-500 to-cyan-300" />
        <div className="absolute right-12 bottom-24 w-64 h-64 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-amber-300 to-pink-400" />
      </div>

      {/* small inline styles for starfield and tilt */}
      <style jsx>{`
        .animate-tilt {
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.02) 1px,
            transparent 1px
          );
          background-size: 3px 3px;
          transform: translateZ(0);
          animation: tilt 60s linear infinite;
        }

        @keyframes tilt {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
          100% {
            transform: translateY(0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
