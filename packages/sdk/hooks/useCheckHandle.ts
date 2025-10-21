"use client";

import { useEffect, useState } from "react";
import { ChainId, getDeployedContract } from "../utils/contract/deployedContracts";
import { useChainId, useReadContract } from "wagmi";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
export type HandleStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid"
  | "error";

export interface UseCheckHandleOptions {
  testMode?: boolean;
  debounceMs?: number;
  minLoadTime?: number;
}

/* -------------------------------------------------------------------------- */
/* Helper: validate handle format                                             */
/* -------------------------------------------------------------------------- */
function validateHandleFormat(handle: string) {
  return /^[a-z0-9_]{3,20}$/.test(handle);
}

/* -------------------------------------------------------------------------- */
/* Hook: useCheckHandle                                                       */
/* -------------------------------------------------------------------------- */
export function useCheckHandle(
  handle: string,
  {  debounceMs = 600, minLoadTime = 400 }: UseCheckHandleOptions = {}
) {
  const chainId = useChainId() as ChainId;
  const [status, setStatus] = useState<HandleStatus>("idle");
  const [lastChecked, setLastChecked] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registry = getDeployedContract(chainId, "VerseProfile");

  /* ---------------------------------------------------------------------- */
  /* 🧠 Wagmi live read hook (used only when NOT in test mode)              */
  /* ---------------------------------------------------------------------- */
  const { data, refetch } = useReadContract({
    abi: registry.abi,
    address: registry.address,
    functionName: "getProfileIdByHandle",
    args: handle && validateHandleFormat(handle) ? [handle.toLowerCase()] : undefined,
    query: {
      enabled:  Boolean(handle && validateHandleFormat(handle)),
    },
  });

  /* ---------------------------------------------------------------------- */
  /* Debounced Handle Checking Logic                                        */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    const h = handle.trim().toLowerCase();

    if (!h) {
      setStatus("idle");
      return;
    }

    if (!validateHandleFormat(h)) {
      setStatus("invalid");
      return;
    }

    const delay = setTimeout(async () => {
      if (lastChecked === h) return;
      setLastChecked(h);
      setStatus("checking");
      setIsLoading(true);

      const start = Date.now();

      try {
       

        /* -------------------------------------------------------------- */
        /* 🌐 Live On-chain Check (via refetch)                           */
        /* -------------------------------------------------------------- */
        const { data: latest } = await refetch();

        // Ensure minimum visible loading time
        const elapsed = Date.now() - start;
        if (elapsed < minLoadTime)
          await new Promise((r) => setTimeout(r, minLoadTime - elapsed));

        if (latest === 0n) {
          setStatus("available");
        } else {
          setStatus("taken");
        }
      } catch (err) {
        console.error("⚠️ Handle check failed:", err);
        setStatus("error");
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(delay);
  }, [handle, lastChecked, debounceMs, minLoadTime, refetch]);

  return {
    status,
    isLoading,
    isAvailable: status === "available",
    isChecking: status === "checking",
  };
}
