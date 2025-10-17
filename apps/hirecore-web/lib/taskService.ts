// lib/fetchTaskById.ts
import { createPublicClient, http, defineChain } from "viem";
import { getDeployedContract, ChainId } from "@verse/sdk/utils/contract/deployedContracts";
import { fetchFromPinata } from "@verse/services/pinata";
import { TokenUtils } from "@verse/sdk/utils/token/tokenUtils";

/* -------------------------------------------------------------------------- */
/* ⚙️ CELO SEPOLIA CONFIG                                                     */
/* -------------------------------------------------------------------------- */
export const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  network: "celo-sepolia",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://forno.celo-sepolia.celo-testnet.org"] },
  },
});

/* -------------------------------------------------------------------------- */
/* 🧠 Simple in-memory cache                                                  */
/* -------------------------------------------------------------------------- */
const taskCache = new Map<number, { data: any; timestamp: number }>();
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
  let metadata: any;
  try {
    metadata = await fetchFromPinata(metadataURI);
  } catch {
    metadata = {};
  }

  /* ---------------------------------------------------------------------- */
  /* 📎 Handle attachments (images, PDFs, etc.)                             */
  /* ---------------------------------------------------------------------- */
  const attachments = (metadata.attachments || []).map((a: any) => {
    const url = typeof a === "string" ? a : a.url;
    return {
      name: a.name || url?.slice(7, 15) + "...",
      url: url?.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/"),
      type: a.type || "unknown",
    };
  });

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
    title: metadata.title ?? `Task #${id}`,
    description: metadata.description ?? "No description available",
    category: metadata.category ?? "general",
    location: metadata.location ?? "unknown",
    urgency: metadata.urgency ?? "medium",
    skills: metadata.skills ?? [],
    attachments,
    coordinates: metadata.coordinates ?? {},
    metadataURI,
    createdAt: metadata.createdAt ?? null,
    postedBy: metadata?.verse?.handle ? `@${metadata.verse.handle}` : "Unknown",
    postedTime: metadata?.createdAt
      ? new Date(metadata.createdAt).toLocaleDateString()
      : "Unknown",
    status: open ? "open" : "closed",
  };

  // ✅ 2. Cache it
  taskCache.set(id, { data: task, timestamp: Date.now() });

  return task;
}
