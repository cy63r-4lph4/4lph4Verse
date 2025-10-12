"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract, useChainId } from "wagmi";
import {
  ChainId,
  getDeployedContract,
} from "../utils/contract/deployedContracts";
import { fetchFromPinata } from "@verse/services/pinata";
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
  const chainId = useChainId() as ChainId;

  const contract = getDeployedContract(chainId, "VerseProfile");
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
  const chainId = useChainId() as ChainId;
  const { verseID, isLoading: idLoading } = useGetVerseID();
  const contract = getDeployedContract(chainId, "VerseProfile");

  const [profile, setProfile] = useState<any>(null);
  const [cacheLoaded, setCacheLoaded] = useState(false);

  const enabled = Boolean(!skip && verseID && contract?.address && cacheLoaded);

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
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    // mark cache as checked so wagmi can start fetching if allowed
    setCacheLoaded(true);
  }, [address]);

  /* -----------------------------------------------------------
   * 2️⃣ Fetch on-chain only after cache is loaded and skip=false
   * ----------------------------------------------------------- */
  useEffect(() => {
    if (!data || !Array.isArray(data) || skip) return;

    (async () => {
      const [owner, handle, metadataURI, ens, createdAt] = data;

      if (metadataURI?.startsWith("ipfs://")) {
        try {
          const json = await fetchFromPinata(metadataURI);
          const fullProfile = {
            verseID,
            address: owner,
            handle,
            metadataURI,
            ensNamehash: ens,
            createdAt: Number(createdAt),
            ...json,
          };

          setProfile(fullProfile);
          localStorage.setItem(
            `verseProfile:${address?.toLowerCase()}`,
            JSON.stringify(fullProfile)
          );
        } catch (err) {
          console.error("Failed to load metadata:", err);
        }
      }
    })();
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



