"use client";

import { useReadContract, useChainId } from "wagmi";
import { getDeployedContract, ChainId } from "../utils/contract/deployedContracts";
import { fetchFromPinata } from "@verse/services/pinata";
import { useEffect, useState } from "react";

export function useProfileById(id?: string | number) {
  const chainId = useChainId() as ChainId;
  const contract = getDeployedContract(chainId, "VerseProfile");
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [verseId, setVerseId] = useState<number | null>(null);

  const enabled = Boolean(contract?.address && id);

  /* ------------------------------------------------
   🧩 Step 1: Resolve handle → verseId (if handle)
  ------------------------------------------------ */
  const { data: idData, error: idError, isLoading: idLoading } = useReadContract({
    abi: contract.abi,
    address: contract.address,
    functionName: "verseIdByHandle",
    args: typeof id === "string" && isNaN(Number(id)) ? [id] : undefined,
    query: {
      enabled: enabled && typeof id === "string" && isNaN(Number(id)),
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (!enabled) return;

    if (typeof id === "number" || (!isNaN(Number(id)) && Number(id) > 0)) {
      // Numeric route param like /profile/5
      setVerseId(Number(id));
      return;
    }

    if (idData !== undefined) {
      // handle lookup returned something
      const numericId = Number(idData);
      if (numericId > 0) {
        setVerseId(numericId);
      } else {
        setError("No profile found for handle: " + id);
        setLoading(false);
      }
    }
  }, [id, idData, enabled]);

  /* ------------------------------------------------
   🧩 Step 2: Fetch onchain profile
  ------------------------------------------------ */
  const { data: profileData, error: readError, isLoading: readLoading } = useReadContract({
    abi: contract.abi,
    address: contract.address,
    functionName: "getProfile",
    args: verseId ? [BigInt(verseId)] : undefined,
    query: {
      enabled: enabled && Boolean(verseId),
      refetchOnWindowFocus: false,
    },
  });

  /* ------------------------------------------------
   🧩 Step 3: Fetch metadata from Pinata
  ------------------------------------------------ */
  useEffect(() => {
    if (!profileData || !Array.isArray(profileData)) return;

    (async () => {
      try {
        const [owner, handle, metadataURI, ens, createdAt] = profileData;
        let metadata = {};

        if (metadataURI?.startsWith("ipfs://")) {
          const json = await fetchFromPinata(metadataURI);
          metadata = json || {};
        }

        setProfile({
          verseId,
          owner,
          handle,
          metadataURI,
          ensNamehash: ens,
          createdAt: Number(createdAt),
          ...metadata,
        });
      } catch (err) {
        console.error("Failed to fetch profile metadata:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [profileData, verseId]);

  /* ------------------------------------------------
   🧩 Step 4: Handle errors + global loading state
  ------------------------------------------------ */
  useEffect(() => {
    if (readError || idError) {
      setError(readError || idError);
      setLoading(false);
    }
  }, [readError, idError]);

  return {
    profile,
    isLoading: isLoading || idLoading || readLoading,
    error,
  };
}
