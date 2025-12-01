"use client";

import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import type { Abi } from "viem";
import { getDeployedContract } from "../utils/contract/deployedContracts";
import { PROFILE_CHAIN } from "../config/constants";
import { validateHandle } from "../utils/handle/validateHandle";

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

  // Validate using production-grade rules
  const validation = validateHandle(debouncedHandle);
  const isValid = validation.valid;

  // Get VerseProfile contract
  const registry = getDeployedContract(PROFILE_CHAIN, "VerseProfile");

  // Only query contract if handle is valid
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
    validationReason: validation.reason, // optional, useful for UX
  };
}
