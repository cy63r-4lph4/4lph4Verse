"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract, useChainId } from "wagmi";
import {
  ChainId,
  getDeployedContract,
} from "../utils/contract/deployedContracts";
import { fetchFromPinata } from "../../../services/pinata";
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
  const enabled = !skip && Boolean(verseID && contract?.address);

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

  const [profile, setProfile] = useState<any>(null);

useEffect(() => {
  if (!address || !verseID) return;

  const cacheKey = `verseProfile:${address.toLowerCase()}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      setProfile(parsed);
      return;
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  (async () => {
    if (data && Array.isArray(data)) {
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
          localStorage.setItem(cacheKey, JSON.stringify(fullProfile));
        } catch (err) {
          console.error("Failed to load metadata:", err);
        }
      }
    }
  })();
}, [data, verseID, address]);


  const refresh = async () => {
    if (skip) return;
    localStorage.removeItem(`verseProfile:${address?.toLowerCase()}`);
    await refetch();
  };

  return {
    verseID: skip ? null : verseID,
    profile: skip ? null : profile,
    isLoading: skip ? false : idLoading || isLoading,
    error: skip ? null : error,
    refetch: refresh,
  };
}

