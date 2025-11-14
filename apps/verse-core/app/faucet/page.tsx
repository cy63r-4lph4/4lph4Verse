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

export default function FaucetPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState("");

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

  const faucetAbi = useMemo(() => (coreFaucet?.abi ?? []) as Abi, [coreFaucet?.abi]);
  const tokenAbi = useMemo(() => (coreToken?.abi ?? []) as Abi, [coreToken?.abi]);

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
    address: mounted && coreToken?.address && hasSymbol ? (coreToken.address as `0x${string}`) : undefined,
    abi: tokenAbi,
    functionName: "symbol",
    query: { enabled: mounted && Boolean(coreToken?.address && hasSymbol) },
  });

  const { data: lastClaim } = useReadContract({
    address: mounted && coreFaucet?.address && lastClaimFn ? (coreFaucet.address as `0x${string}`) : undefined,
    abi: faucetAbi,
    functionName: lastClaimFn,
    args: mounted && address && lastClaimFn ? [address] : undefined,
    query: {
      enabled: mounted && Boolean(address && coreFaucet?.address && lastClaimFn),
      refetchInterval: 5000,
    },
  });

  const { data: cooldown } = useReadContract({
    address: mounted && coreFaucet?.address && cooldownFn ? (coreFaucet.address as `0x${string}`) : undefined,
    abi: faucetAbi,
    functionName: cooldownFn,
    query: {
      enabled: mounted && Boolean(coreFaucet?.address && cooldownFn),
      refetchInterval: 60000,
    },
  });

  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    if (!mounted || typeof lastClaim === "undefined" || typeof cooldown === "undefined") {
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

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash: txHash });

  const handleClaim = () => {
    if (!coreFaucet?.address) return;
    if (!remaining !== null && remaining !== 0) return;
    setStatus("");
    try {
      writeContract({ address: coreFaucet.address as `0x${string}`, abi: faucetAbi, functionName: "claim" });
    } catch (err: unknown) {
      setStatus(isErrorWithMessage(err) ? err.message : "Transaction failed");
    }
  };

  const addToken = async () => {
    if (!mounted || !coreToken) return;
    const provider: Eip1193Provider | undefined = (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
    if (!provider) return;
    try {
      await provider.request({ method: "wallet_watchAsset", params: { type: "ERC20", options: { address: coreToken.address, symbol: (tokenSymbol as string) || "CORE", decimals: 18 } } });
    } catch {
      setStatus("Failed to add token");
    }
  };

  const readsReady = remaining !== null;
  const canClaim = readsReady && remaining === 0 && !isPending && !isConfirming;

  const controls = useAnimation();
  useEffect(() => { if (isPending || isConfirming) controls.start({ scale: [1, 0.98, 1] }); else controls.start({ scale: 1 }); }, [isPending, isConfirming, controls]);

  const cooldownNumber = cooldown ? Number(cooldown) : null;
  const progress = remaining === null || !cooldownNumber ? 1 : Math.max(0, 1 - remaining / cooldownNumber);

  const timeLabel = !readsReady ? "—" : remaining && remaining > 0 ? `Next claim in ${TimeUtils.formatRemaining(remaining)}` : "Ready to claim";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#020214] via-[#070428] to-[#00020a] text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-20">
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-600/10 w-[900px] h-[900px] blur-sm" animate={{ rotate: -360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/8 w-[600px] h-[600px] blur-md" animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,77,255,0.06),transparent_20%),radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.04),transparent_20%)] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <div className="rounded-3xl p-8 bg-gradient-to-br from-white/5 to-white/3 border border-white/5 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-200">CLAIM THE CØRE</h1>
            <p className="max-w-xl text-sm text-slate-300">Synchronize your wallet and harvest the daily cosmic allocation of CØRE. The rift recharges between claims.</p>

            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <motion.div className="absolute inset-0 flex items-center justify-center" animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity }}>
                <svg className="w-56 h-56 md:w-72 md:h-72" viewBox="0 0 120 120">
                  <defs><linearGradient id="mx1" x1="0%" x2="100%"><stop offset="0%" stopColor="#0ea5e9" /><stop offset="50%" stopColor="#7c4dff" /><stop offset="100%" stopColor="#ffd166" /></linearGradient></defs>
                  <circle cx="60" cy="60" r="48" stroke="rgba(255,255,255,0.04)" strokeWidth="8" fill="none" />
                  <motion.circle cx="60" cy="60" r="48" stroke="url(#mx1)" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray={Math.PI * 2 * 48} animate={{ strokeDashoffset: (1 - progress) * Math.PI * 2 * 48 }} transition={{ duration: 0.7 }} style={{ rotate: -90 }} />
                </svg>

                <motion.div className="absolute w-28 h-28 md:w-36 md:h-36 flex items-center justify-center" initial={{ scale: 0.98 }} animate={{ rotate: [0, 6, 0, -6, 0], scale: [1, 1.02, 1] }} transition={{ duration: 6, repeat: Infinity }}>
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 rounded-xl blur-2xl opacity-70 bg-gradient-to-tr from-[#06b6d4]/40 via-[#7c3aed]/30 to-[#f59e0b]/20" />
                    <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full"><g transform="translate(50,50)"><path d="M0-26 L14 -6 L9 22 L-9 22 L-14 -6 Z" fill="#60a5fa" opacity="0.95" /><path d="M0 26 L-14 6 L-9 -22 L9 -22 L14 6 Z" fill="#a78bfa" opacity="0.9" /></g></svg>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-4 mt-2">
              <motion.button className="flex-1 py-4 rounded-2xl font-extrabold text-lg shadow-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed" onClick={handleClaim} disabled={!canClaim} animate={controls} whileTap={{ scale: 0.98 }}>
                {!readsReady ? "Aligning rift…" : isPending ? "Confirm in wallet…" : isConfirming ? "Claiming…" : remaining! > 0 ? `Harvest in ${TimeUtils.formatRemaining(remaining!)}` : "Harvest CØRE — Claim Now"}
              </motion.button>

              <button onClick={addToken} className="w-full sm:w-44 py-3 rounded-2xl font-semibold border border-white/10 bg-black/20">Add CØRE</button>
            </div>

            <div className="w-full">
              {(!lastClaimFn || !cooldownFn) && (<p className="text-amber-300 text-sm">Heads up: faucet ABI doesn’t expose expected getters; UI will skip cooldown gating.</p>)}
              {writeError && <TxErrorCard error={writeError} onRetry={handleClaim} />}
              {isReceiptError && <TxErrorCard error={receiptError || new Error("Transaction reverted. Likely cooldown still active.")} />}
              {isSuccess && <p className="mt-2 text-center text-green-400 text-sm">ENERGY TRANSFER COMPLETE ⚡</p>}
              {status && !writeError && !isReceiptError && <p className="mt-2 text-center text-cyan-300 text-sm">{status}</p>}
              <p className="mt-3 text-center text-xs text-slate-400">{timeLabel}</p>
            </div>

            <div className="w-full mt-4 flex justify-center"><ConnectWalletButton variant="primary" rounded="lg" faucet /></div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">Tip: animations respect your OS reduced-motion setting.</div>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-8 top-12 w-48 h-48 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-purple-500 to-cyan-300" />
        <div className="absolute right-12 bottom-24 w-64 h-64 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-amber-300 to-pink-400" />
      </div>

      <style jsx>{` .shadow-2xl { box-shadow: 0 20px 50px rgba(2,6,23,0.7); } .active\\:scale-98:active { transform: scale(0.98); } `}</style>
    </div>
  );
}
