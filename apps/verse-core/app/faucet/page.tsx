"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useChainId,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import type { Abi } from "viem";
import { deployedContracts } from "@verse/sdk/utils/contract/deployedContracts";
import ConnectWalletButton from "@verse/sdk/ConnectWalletButton";
import TxErrorCard from "@verse-core/components/ErrorCard";
import { TimeUtils } from "@verse/sdk/utils/time/timeUtils";

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

  // Resolve from SDK
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

  // Pick the right function names from the faucet ABI
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#030314] to-[#0b0b1f] text-white p-6">
      <h1 className="text-4xl font-extrabold text-cyan-400 mb-8">
        4lph4Verse Faucet
      </h1>

      <ConnectWalletButton variant="primary" rounded="lg" className="mb-6" faucet />

      {mounted && isConnected && coreFaucet?.address && (
        <div className="w-full max-w-md p-6 rounded-2xl border border-cyan-400/20 shadow-2xl space-y-5 bg-white/5 backdrop-blur-md">
          {/* Warn if ABI misses expected getters */}
          {(!lastClaimFn || !cooldownFn) && (
            <p className="text-amber-300 text-sm">
              Heads up: faucet ABI doesn’t expose expected getters (found
              lastClaim: {String(!!lastClaimFn)}, cooldown:{" "}
              {String(!!cooldownFn)}). UI will skip cooldown gating.
            </p>
          )}

          <button
            disabled={!canClaim}
            onClick={handleClaim}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-xl font-bold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {!readsReady
              ? "Loading…"
              : isPending
                ? "Confirm in wallet…"
                : isConfirming
                  ? "Claiming…"
                  : remaining! > 0
                    ? `Next claim in ${TimeUtils.formatRemaining(remaining!)}`
                    : "Claim CØRE Tokens 🚀"}
          </button>

          <button
            onClick={addToken}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold border border-cyan-400/40"
          >
            Add CØRE to Wallet
          </button>

          {writeError && (
            <TxErrorCard error={writeError} onRetry={handleClaim} />
          )}
          {isReceiptError && (
            <TxErrorCard
              error={
                receiptError ||
                new Error("Transaction reverted. Likely cooldown still active.")
              }
            />
          )}
          {isSuccess && (
            <p className="text-center text-green-400 text-sm">
              Claimed successfully!
            </p>
          )}
          {status && !writeError && !isReceiptError && (
            <p className="text-center text-cyan-300 text-sm">{status}</p>
          )}
        </div>
      )}
    </div>
  );
}
