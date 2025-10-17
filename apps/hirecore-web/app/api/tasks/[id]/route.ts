import { NextResponse } from "next/server";
import { createPublicClient, http, defineChain } from "viem";
import { getDeployedContract, ChainId } from "@verse/sdk/utils/contract/deployedContracts";
import { fetchFromPinata } from "@verse/services/pinata";
import { TokenUtils } from "@verse/sdk/utils/token/tokenUtils";

/* -------------------------------------------------------------------------- */
/* ⚙️  CELO SEPOLIA CONFIG                                                    */
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
/* 🧠  Simple in-memory cache                                                 */
/* -------------------------------------------------------------------------- */
const taskCache = new Map<number, { data: any; timestamp: number }>();
const CACHE_TTL = 60_000; // 1 minute

/* -------------------------------------------------------------------------- */
/* 🚀  GET HANDLER                                                           */
/* -------------------------------------------------------------------------- */
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const numericId = Number(id);

  if (!numericId) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }

  // ✅ Step 1: Check cache first
  const cached = taskCache.get(numericId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const chainId = 11142220 as ChainId;
    const jobBoard = getDeployedContract(chainId, "HireCoreJobBoard");

    const client = createPublicClient({
      chain: celoSepolia,
      transport: http(celoSepolia.rpcUrls.default.http[0]),
    });

    /* ---------------------------------------------------------------------- */
    /*  🔍 Read on-chain data for this post ID                                 */
    /* ---------------------------------------------------------------------- */
    const res = (await client.readContract({
      ...jobBoard,
      functionName: "posts",
      args: [BigInt(numericId)],
    })) as [
      `0x${string}`, // hirer
      `0x${string}`, // paymentToken
      bigint, // budgetMax
      bigint, // expiry
      bigint, // deposit
      string, // metadataURI
      boolean // open
    ];

    if (!res || res.length < 7) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const [hirer, paymentToken, budgetMax, expiry, deposit, metadataURI, open] = res;

    if (hirer === "0x0000000000000000000000000000000000000000" || !open) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    /* ---------------------------------------------------------------------- */
    /*  📦 Fetch metadata from Pinata / IPFS                                   */
    /* ---------------------------------------------------------------------- */
    let metadata: any;
    try {
      metadata = await fetchFromPinata(metadataURI);
    } catch {
      metadata = {};
    }

    /* ---------------------------------------------------------------------- */
    /*  📎 Handle attachments (images, PDFs, etc.)                             */
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
    /*  🧱 Construct flattened Task object                                     */
    /* ---------------------------------------------------------------------- */
    const task = {
      id: numericId,
      hirer,
      paymentToken,
      budget: Number(TokenUtils.format(budgetMax, 18)),
      deposit: Number(TokenUtils.format(deposit, 18)),
      expiry: Number(expiry),
      title: metadata.title ?? `Task #${numericId}`,
      description: metadata.description ?? "No description available",
      category: metadata.category ?? "general",
      location: metadata.location ?? "unknown",
      urgency: metadata.urgency ?? "medium",
      skills: metadata.skills ?? [],
      attachments,
      metadataURI,
      createdAt: metadata.createdAt ?? null,
      postedBy: metadata?.verse?.handle ? `@${metadata.verse.handle}` : "Unknown",
      postedTime: metadata?.createdAt
        ? new Date(metadata.createdAt).toLocaleDateString()
        : "Unknown",
      status: open ? "open" : "closed",
    };

    // ✅ Step 2: Cache the result
    taskCache.set(numericId, { data: task, timestamp: Date.now() });

    return NextResponse.json(task);
  } catch (err) {
    console.error("❌ Task fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}
