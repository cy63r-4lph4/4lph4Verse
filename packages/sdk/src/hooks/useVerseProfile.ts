"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract, useChainId } from "wagmi";
import { getDeployedContract } from "../utils/contract/deployedContracts";
import { PROFILE_CHAIN } from "../config/constants";
import { fetchFromPinata } from "../services/storage";
import { VerseProfile } from "src/types";
import { parseVerseProfile } from "src/utils/profile/parseVerseProfile";
/* ------------------------- Types ------------------------- */
interface UseGetVerseIDResult {
  verseID: number | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => Promise<void>;
}

interface UseVerseProfileResult {
  verseID: number | null;
  profile: any;
  isLoading: boolean;
  error: unknown;
  refetch: () => Promise<void>;
}

/* ------------------------- Hook: useGetVerseID ------------------------- */
export function useGetVerseID(): UseGetVerseIDResult {
  const { address } = useAccount();

  const contract = getDeployedContract(PROFILE_CHAIN, "VerseProfile");
  const enabled = Boolean(address && contract?.address);

  const { data, isLoading, error, refetch } = useReadContract({
    abi: contract.abi,
    address: contract.address,
    functionName: "profileOf",
    args: address ? [address] : undefined,
    query: {
      enabled,
      refetchOnWindowFocus: false,
    },
  });

  // Wrap refetch to remove TanStack types
  const refresh = async () => {
    await refetch();
  };

  return {
    verseID: data ? Number(data) : null,
    isLoading,
    error,
    refetch: refresh,
  };
}

/* ------------------------- Hook: useVerseProfile ------------------------- */
export function useVerseProfile(skip = false): UseVerseProfileResult {
  const { address } = useAccount();
  const { verseID, isLoading: idLoading } = useGetVerseID();
  const contract = getDeployedContract(PROFILE_CHAIN, "VerseProfile");

  const [profile, setProfile] = useState<any>(null);
  const [cacheLoaded, setCacheLoaded] = useState(false);
  const [hasCache, setHasCache] = useState(false);

  const enabled = Boolean(
    !skip && !hasCache && verseID && contract?.address && cacheLoaded
  );

  const { data, isLoading, error, refetch } = useReadContract({
    abi: contract.abi,
    address: contract.address,
    functionName: "getProfile",
    args: verseID ? [verseID] : undefined,
    query: {
      enabled,
      refetchOnWindowFocus: false,
    },
  });
  /* -----------------------------------------------------------
   * 1️⃣ Always check cache first (even if skip=true)
   * ----------------------------------------------------------- */
  useEffect(() => {
    if (!address) return;

    const cacheKey = `verseProfile:${address.toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProfile(parsed);
        setHasCache(true); // <-- important
      } catch {
        localStorage.removeItem(cacheKey);
        setHasCache(false);
      }
    } else {
      setHasCache(false);
    }

    setCacheLoaded(true);
  }, [address]);

  /* -----------------------------------------------------------
   * 2️⃣ Fetch on-chain only after cache is loaded and skip=false
   * ----------------------------------------------------------- */
  useEffect(() => {
    if (!data || !verseID) return;

    const parsed = parseVerseProfile(data, verseID);
    setProfile(parsed);
    try {
      // Cache locally
      if (address) {
        localStorage.setItem(
          `verseProfile:${address.toLowerCase()}`,
          JSON.stringify(parsed)
        );
      }
    } catch (err) {
      console.error("Failed to load metadata:", err);
    }
  }, [data, verseID, address, skip]);

  /* -----------------------------------------------------------
   * 3️⃣ Manual refresh clears cache + forces new fetch
   * ----------------------------------------------------------- */
  const refresh = async () => {
    if (!address) return;
    const cacheKey = `verseProfile:${address.toLowerCase()}`;
    localStorage.removeItem(cacheKey);
    setCacheLoaded(false);
    await refetch();
  };

  return {
    verseID,
    profile,
    isLoading: idLoading || isLoading,
    error,
    refetch: refresh,
  };
}
