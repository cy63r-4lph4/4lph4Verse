"use client";

import { useReadContract } from "wagmi";
import { getDeployedContract } from "../utils/contract/deployedContracts";
import { useEffect, useState } from "react";
import { PROFILE_CHAIN } from "../config/constants";
import { fetchFromPinata } from "../services/storage";

/* --------------------------------------------------
 🧠 In-memory cache
-------------------------------------------------- */
const profileCache = new Map<
  string | number,
  { data: any; timestamp: number }
>();
const CACHE_TTL = 60_000; // 1 minute

export function useProfileById(id?: string | number) {
  const contract = getDeployedContract(PROFILE_CHAIN, "VerseProfile");

  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [verseId, setVerseId] = useState<number | null>(null);

  const enabled = Boolean(contract?.address && id);

  /* ------------------------------------------------
   ⚡ Step 0: Serve from cache instantly if present
  ------------------------------------------------ */
  useEffect(() => {
    if (!id) return;
    const cached = profileCache.get(id);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setProfile(cached.data);
      setLoading(false);
    }
  }, [id]);

  /* ------------------------------------------------
   🧩 Step 1: Resolve handle → verseId (if handle)
  ------------------------------------------------ */
  const {
    data: idData,
    error: idError,
    isLoading: idLoading,
  } = useReadContract({
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
      setVerseId(Number(id));
      return;
    }

    if (idData !== undefined) {
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
   🧩 Step 2: Fetch onchain profile (getProfile)
  ------------------------------------------------ */
  const {
    data: profileData,
    error: readError,
    isLoading: readLoading,
  } = useReadContract({
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
   🧩 Step 3: Fetch metadata from Pinata + cache it
  ------------------------------------------------ */
  useEffect(() => {
    if (!profileData || typeof data !== "object") return;

    (async () => {
      try {
        const [owner, handle, metadataURI, ens, createdAt] = profileData;

        let metadata = {};
        if (metadataURI?.startsWith("ipfs://")) {
          try {
            const json = await fetchFromPinata(metadataURI);
            metadata = json || {};
          } catch (err) {
            console.warn("⚠️ Failed to load IPFS metadata:", err);
          }
        }

        const finalProfile = {
          verseId,
          owner,
          handle,
          metadataURI,
          ensNamehash: ens,
          createdAt: Number(createdAt),
          ...metadata,
        };

        profileCache.set(id!, {
          data: finalProfile,
          timestamp: Date.now(),
        });

        setProfile(finalProfile);
      } catch (err) {
        console.error("❌ Failed to fetch profile metadata:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [profileData, verseId, id]);

  /* ------------------------------------------------
   🧩 Step 4: Handle errors gracefully
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
    refetch: async () => {
      profileCache.delete(id!);
      setLoading(true);
      setProfile(null);
      setVerseId(null);
    },
  };
}
