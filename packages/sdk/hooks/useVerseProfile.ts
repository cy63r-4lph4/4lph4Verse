"use client";

import { useAccount, useChainId, useReadContract } from "wagmi";
import type { Abi } from "viem";
import { useMemo, useCallback } from "react";
import { deployedContracts } from "../utils/contract/deployedContracts";

/* ---------- Your public shapes (no tanstack types) ---------- */
type MinimalProfile = {
  handle: string;
  displayName: string;
  bio: string;
  avatar: string;
};

type UseVerseProfileOptions = {
  contractName?: string;       // default: "VerseProfile"
  readFunctionName?: string;   // default: "getProfile"
  select?: (raw: any) => MinimalProfile | null;
};

type UseVerseProfileResult = {
  chainId: number;
  contractAddress?: `0x${string}`;
  profile: MinimalProfile | null;
  exists: boolean;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  /** wrapped so tanstack types don't leak */
  refetch: () => void;
  /** returns true if profile exists, else calls onMissing and returns false */
  requireProfile: (onMissing?: () => void) => boolean;
};

export function useVerseProfile(
  opts: UseVerseProfileOptions = {}
): UseVerseProfileResult {
  const { address } = useAccount();
  const chainId = useChainId();

  const {
    contractName = "VerseProfile",
    readFunctionName = "getProfile",
    select,
  } = opts;

  // resolve contract from generated deployments
  const contract = useMemo(() => {
    const key = String(chainId) as keyof typeof deployedContracts;
    const found = (deployedContracts as Record<string, any>)[chainId]?.[contractName];
    return found
      ? {
          address: found.address as `0x${string}`,
          abi: found.abi as Abi,
        }
      : undefined;
  }, [chainId, contractName]);

  const read = useReadContract({
    abi: contract?.abi,
    address: contract?.address,
    functionName: readFunctionName as any,
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && contract?.address) },
  });

  // normalize → MinimalProfile
  const profile: MinimalProfile | null = useMemo(() => {
    if (!read.data) return null;
    if (select) return select(read.data);

    try {
      const tuple = read.data as any[];
      if (!Array.isArray(tuple) || tuple.length < 4) return null;
      const [handle, displayName, bio, avatar] = tuple;
      if (!handle || String(handle).trim().length === 0) return null;
      return {
        handle: String(handle),
        displayName: String(displayName ?? ""),
        bio: String(bio ?? ""),
        avatar: String(avatar ?? ""),
      };
    } catch {
      return null;
    }
  }, [read.data, select]);

  const exists = Boolean(profile);

  // wrap to avoid exposing tanstack types
  const refetch = useCallback(() => {
    void read.refetch(); // intentionally drop promise type
  }, [read.refetch]);

  const requireProfile = useCallback(
    (onMissing?: () => void) => {
      if (!address) return false;
      if (!exists) {
        onMissing?.();
        return false;
      }
      return true;
    },
    [address, exists]
  );

  return {
    chainId,
    contractAddress: contract?.address,
    profile,
    exists,
    isLoading: read.isLoading,
    isFetching: read.isFetching,
    error: (read.error as Error) ?? null,
    refetch,
    requireProfile,
  };
}
