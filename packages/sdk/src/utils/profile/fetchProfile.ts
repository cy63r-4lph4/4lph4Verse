// utils/profile/fetchVerseProfile.ts
import { createPublicClient, http } from "viem";
import { getDeployedContract, ChainId } from "../contract/deployedContracts";
import { celoSepolia } from "viem/chains";
import { PROFILE_CHAIN } from "../../config/constants";
import { fetchFromPinata } from "../../services/storage";

/* -------------------------------------------------------------------------- */
/* 🧠 Simple in-memory cache                                                  */
/* -------------------------------------------------------------------------- */
const profileCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60_000; // 1 minute

export async function fetchVerseProfile(
  idOrHandle: string | number,
  chainId: ChainId = 11142220
) {
  try {
    const key = String(idOrHandle).trim();

    if (!key || key === "undefined" || key === "null") {
      console.warn("⚠️ fetchVerseProfile: invalid input", idOrHandle);
      return null;
    }

    // ✅ cache check
    const cached = profileCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const client = createPublicClient({
      chain: celoSepolia,
      transport: http(celoSepolia.rpcUrls.default.http[0]),
    });

    const registry = getDeployedContract(PROFILE_CHAIN, "VerseProfile");

    /* ---------------------------------------------------------------------- */
    /* 🧩 Step 1: Resolve to verseId                                           */
    /* ---------------------------------------------------------------------- */
    let verseId: bigint = 0n;

    if (key.startsWith("@")) {
      // handle → id
      const handle = key.replace("@", "");
      verseId = (await client.readContract({
        ...registry,
        functionName: "verseIdByHandle",
        args: [handle],
      })) as bigint;
    } else if (key.startsWith("0x")) {
      // address → id
      verseId = (await client.readContract({
        ...registry,
        functionName: "verseIdByAddress",
        args: [key],
      })) as bigint;
    } else if (!isNaN(Number(key))) {
      // numeric id
      verseId = BigInt(key);
    }

    if (!verseId || verseId === 0n) {
      console.warn("⚠️ fetchVerseProfile: No verseId found for", key);
      return null;
    }

    /* ---------------------------------------------------------------------- */
    /* 🧱 Step 2: Read profile data                                            */
    /* ---------------------------------------------------------------------- */
    const res = (await client.readContract({
      ...registry,
      functionName: "getProfile",
      args: [verseId],
    })) as [`0x${string}`, string, string, string, bigint];

    const [owner, handle, metadataURI, ensNamehash, createdAt] = res;

    /* ---------------------------------------------------------------------- */
    /* 📦 Step 3: Fetch offchain metadata                                     */
    /* ---------------------------------------------------------------------- */
    let metadata: any = {};
    if (metadataURI?.startsWith("ipfs://")) {
      try {
        metadata = await fetchFromPinata(metadataURI);
      } catch (err) {
        console.warn("⚠️ Failed to fetch profile metadata:", metadataURI, err);
      }
    }

    /* ---------------------------------------------------------------------- */
    /* 🧩 Step 4: Construct final profile object                               */
    /* ---------------------------------------------------------------------- */
    const profile = {
      verseId: verseId.toString(),
      owner,
      handle,
      metadataURI,
      ensNamehash,
      createdAt: Number(createdAt),
      ...metadata,
    };

    // ✅ cache it
    profileCache.set(key, { data: profile, timestamp: Date.now() });

    return profile;
  } catch (err) {
    console.error("❌ fetchVerseProfile:", err);
    return null;
  }
}
