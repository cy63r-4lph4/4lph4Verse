"use client";

import { useChainId, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import type { Abi } from "viem";
import {
  ChainId,
  getDeployedContract,
} from "../utils/contract/deployedContracts";
import { PROFILE_CHAIN } from "../config/constants";

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

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
function validateHandleFormat(handle: string) {
  return /^[a-z0-9_]{3,20}$/.test(handle);
}

function useDebounce<T>(value: T, delay = 600): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

/* -------------------------------------------------------------------------- */
/* Main Hook                                                                  */
/* -------------------------------------------------------------------------- */
export function useCheckHandle(handle: string) {
  const [status, setStatus] = useState<HandleStatus>("idle");

  // 🕓 Debounce user input so it only queries after typing stops
  const debouncedHandle = useDebounce(handle.trim().toLowerCase(), 600);
  const isValid = validateHandleFormat(debouncedHandle);

  const registry = getDeployedContract(PROFILE_CHAIN, "VerseProfile");

  const { data, isLoading, error } = useReadContract({
    chainId: PROFILE_CHAIN,
    abi: registry.abi as Abi,
    address: registry.address as `0x${string}`,
    functionName: "verseIdByHandle",
    args: isValid && debouncedHandle ? [debouncedHandle] : undefined,
    query: { enabled: Boolean(isValid && debouncedHandle) },
  });
  /* ---------------------------------------------------------------------- */
  /* Reactively compute status based on wagmi state                         */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    if (!debouncedHandle) return setStatus("idle");
    if (!isValid) return setStatus("invalid");
    if (isLoading) return setStatus("checking");
    if (error) return setStatus("error");

    if (data === undefined) return setStatus("idle");
    if (data === 0n) setStatus("available");
    else setStatus("taken");
  }, [debouncedHandle, isValid, data, isLoading, error]);

  return {
    status,
    isChecking: isLoading,
    isAvailable: status === "available",
  };
}
