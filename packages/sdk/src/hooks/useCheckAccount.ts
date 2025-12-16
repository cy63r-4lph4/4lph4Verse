"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { getDeployedContract } from "@verse/sdk/utils/contract/deployedContracts";
import { PROFILE_CHAIN } from "@verse/sdk/config/constants";

type UseCheckProfileResult = {
  hasProfile: boolean;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  hasCache: boolean;
};

export function useCheckProfile(): UseCheckProfileResult {
  const { address } = useAccount();
  const contract = getDeployedContract(PROFILE_CHAIN, "VerseProfile");

  const [hasCache, setHasCache] = useState(false);
  const [cacheChecked, setCacheChecked] = useState(false);

  /* -------------------------------------------------------
   * 1️⃣ Check cache AFTER mount — not during render
   * ------------------------------------------------------- */
  useEffect(() => {
    if (!address) {
      setHasCache(false);
      setCacheChecked(true);
      return;
    }

    const cacheKey = `verseProfile:${address.toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);

    setHasCache(Boolean(cached));
    setCacheChecked(true);
  }, [address]);

  /* -------------------------------------------------------
   * 2️⃣ Only enable on-chain check after cache is checked
   * ------------------------------------------------------- */
  const enabled = Boolean(
    address && contract?.address && cacheChecked // prevents wagmi from firing too early
  );

  const { data, isLoading, error, refetch } = useReadContract({
    abi: contract.abi,
    address: contract.address,
    functionName: "hasProfile",
    args: address ? [address] : undefined,
    query: {
      enabled,
      refetchOnWindowFocus: false,
    },
  });

  const hasProfile = Boolean(data);
  console.log(hasProfile,hasCache)

  return {
    hasProfile,
    isLoading,
    error,
    refetch,
    hasCache,
  };
}
