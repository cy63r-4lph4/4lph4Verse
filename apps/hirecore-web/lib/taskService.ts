// lib/fetchTaskById.ts
import { getDeployedContract, ChainId } from "@verse/sdk/utils/contract/deployedContracts";
import { TokenUtils } from "@verse/sdk/utils/token/tokenUtils";
import { createPublicClient, http } from "viem";
import { celoSepolia } from "viem/chains";
import {fetchVerseProfile} from "@verse/sdk/utils/profile/fetchProfile";
import { Task } from "@verse/hirecore-web/app/task/[id]/sections/types";
import { Attachment, TaskMetadata } from "@verse/hirecore-web/utils/Interfaces";
import { fetchFromPinata } from "@verse/sdk/services/storage";



/* -------------------------------------------------------------------------- */
/* 🧠 Simple in-memory cache                                                  */
/* -------------------------------------------------------------------------- */
const taskCache = new Map<number, { data: Task; timestamp: number }>();
const CACHE_TTL = 60_000; // 1 minute

/* -------------------------------------------------------------------------- */
/* 🚀 Shared function: fetchTaskById                                          */
/* -------------------------------------------------------------------------- */
export async function fetchTaskById(id: number, chainId: ChainId = 11142220) {
  if (!id) throw new Error("Invalid task ID");

  // ✅ 1. Check cache
  const cached = taskCache.get(id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const jobBoard = getDeployedContract(chainId, "HireCoreJobBoard");
  const client = createPublicClient({
    chain: celoSepolia,
    transport: http(celoSepolia.rpcUrls.default.http[0]),
  });

  /* ---------------------------------------------------------------------- */
  /* 🔍 Read on-chain data for this post ID                                 */
  /* ---------------------------------------------------------------------- */
  const res = (await client.readContract({
    ...jobBoard,
    functionName: "posts",
    args: [BigInt(id)],
  })) as [
    `0x${string}`,
    `0x${string}`,
    bigint,
    bigint,
    bigint,
    string,
    boolean
  ];

  if (!res || res.length < 7) throw new Error("Task not found");

  const [hirer, paymentToken, budgetMax, expiry, deposit, metadataURI, open] = res;
  if (hirer === "0x0000000000000000000000000000000000000000" || !open)
    throw new Error("Task not found");

  /* ---------------------------------------------------------------------- */
  /* 📦 Fetch metadata from Pinata / IPFS                                   */
  /* ---------------------------------------------------------------------- */
  let metadata: TaskMetadata|null = null;
  try {
    metadata = await fetchFromPinata(metadataURI);
  } catch {
    metadata = null;
  }

  /* ---------------------------------------------------------------------- */
  /* 📎 Handle attachments (images, PDFs, etc.)                             */
  /* ---------------------------------------------------------------------- */
 const attachments = await Promise.all(
  (metadata?.attachments || []).map(async (a: Attachment) => {
    const url = typeof a === "string" ? a : a.url;
    const fullUrl = url?.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
    let type = a.type || "unknown";

    const lower = (url || "").toLowerCase();
    if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) type = "image";
    else if (lower.match(/\.(pdf)$/)) type = "pdf";
    else if (type === "unknown") type = await detectMimeType(fullUrl);

    return {
      name: a.name || url?.slice(7, 15) + "...",
      url: fullUrl,
      type,
    };
  })
);
 let hirerProfile = null;
if (metadata?.verse?.verseId) {
  hirerProfile = await fetchVerseProfile(metadata.verse.verseId);
}

  /* ---------------------------------------------------------------------- */
  /* 🧱 Construct flattened Task object                                     */
  /* ---------------------------------------------------------------------- */
  const task = {
    id,
    hirer,
    paymentToken,
    budget: Number(TokenUtils.format(budgetMax, 18)),
    deposit: Number(TokenUtils.format(deposit, 18)),
    expiry: Number(expiry),
    title: metadata?.title ?? `Task #${id}`,
    description: metadata?.description ?? "No description available",
    category: metadata?.category ?? "general",
    location: metadata?.location ?? "unknown",
    urgency: metadata?.urgency ?? "medium",
    skills: metadata?.skills ?? [],
    attachments,
    coordinates: metadata?.coordinates ?? {},
    metadataURI,
    createdAt: metadata?.createdAt ?? null,
    postedByProfile: hirerProfile,
postedBy:
  hirerProfile?.displayName
    ? hirerProfile.displayName
    : hirerProfile?.handle
    ? `@${hirerProfile.handle}`
    : "Unknown",

    postedTime: metadata?.createdAt
      ? new Date(metadata.createdAt).toLocaleDateString()
      : "Unknown",
    status: open ? "open" : "closed",
  };

  // ✅ 2. Cache it
  taskCache.set(id, { data: task, timestamp: Date.now() });

  return task;
}


async function detectMimeType(url: string): Promise<string> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const type = res.headers.get("content-type");
    if (!type) return "unknown";
    if (type.includes("image")) return "image";
    if (type.includes("pdf")) return "pdf";
    if (type.includes("video")) return "video";
    if (type.includes("audio")) return "audio";
    return type;
  } catch {
    return "unknown";
  }
}
