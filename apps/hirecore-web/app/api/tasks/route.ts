import { NextResponse } from "next/server";
import { defineChain, createPublicClient, http } from "viem";
import { getDeployedContract, ChainId } from "@verse/sdk/utils/contract/deployedContracts";
import { fetchFromPinata } from "@verse/services/pinata/fetchFromPinata";
import { TokenUtils } from "@verse/sdk/utils/token/tokenUtils";
import { Task } from "@verse/hirecore-web/app/task/[id]/sections/types";
/* -------------------------------------------------------------------------- */
/*  Basic cache to avoid refetching on every request                          */
/* -------------------------------------------------------------------------- */
const cache = new Map<string, CachedPayload>();
const CACHE_TTL = 60_000; // 1 minute
const PAGE_SIZE = 6;

interface CachedPayload {
  data: {
    data: Task[];
    total: number;
    page: number;
    pages: number;
    hasMore?: boolean;
  };
  timestamp: number;
}

/* -------------------------------------------------------------------------- */
/*  CELO SEPOLIA CONFIG                                                       */
/* -------------------------------------------------------------------------- */
export const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  network: "celo-sepolia",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://forno.celo-sepolia.celo-testnet.org"] },
    public: { http: ["https://forno.celo-sepolia.celo-testnet.org"] },
  },
  blockExplorers: {
    default: {
      name: "Celo Sepolia Blockscout",
      url: "https://celo-sepolia.blockscout.com",
    },
  },
});

/* -------------------------------------------------------------------------- */
/*  MAIN GET HANDLER                                                          */
/* -------------------------------------------------------------------------- */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const chainId = Number(searchParams.get("chainId")) || 11142220;
  const category = searchParams.get("category") ?? "all";
  const location = searchParams.get("location") ?? "all";
  const urgency = searchParams.get("urgency") ?? "all";
  const minBudget = Number(searchParams.get("minBudget") ?? 0);
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const limit = Math.max(Number(searchParams.get("limit") ?? PAGE_SIZE), 1);

  const isFiltered =
    category !== "all" ||
    location !== "all" ||
    urgency !== "all" ||
    minBudget > 0;

  const cacheKey = req.url;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const jobBoard = getDeployedContract(chainId as ChainId, "HireCoreJobBoard");
    const client = createPublicClient({
      chain: celoSepolia,
      transport: http(celoSepolia.rpcUrls.default.http[0]),
    });

    /* -------------------- Fetch total number of posts -------------------- */
    const postCount = (await client.readContract({
      ...jobBoard,
      functionName: "nextPostId",
    })) as bigint;

    const totalPosts = Number(postCount) - 1;
    if (totalPosts <= 0) {
      return NextResponse.json({ data: [], total: 0, page, pages: 0 });
    }

    /* --------------------- Determine post IDs to load -------------------- */
    const indices = isFiltered
      ? Array.from(
          { length: limit },
          (_, i) => totalPosts - (page - 1) * limit - i
        ).filter((id) => id > 0)
      : Array.from({ length: totalPosts }, (_, i) => i + 1);

    /* ---------------------- Helper: Fetch one post ---------------------- */
    async function fetchPost(postId: number): Promise<Task | null> {
      try {
        const res = (await client.readContract({
          ...jobBoard,
          functionName: "posts",
          args: [BigInt(postId)],
        })) as [
          `0x${string}`, // hirer
          `0x${string}`, // paymentToken
          bigint, // budgetMax
          bigint, // expiry
          bigint, // deposit
          string, // metadataURI
          boolean // open
        ];

        if (!res || res.length < 7) return null;
        const [hirer, paymentToken, budgetMax, expiry, deposit, metadataURI, open] = res;
        if (hirer === "0x0000000000000000000000000000000000000000" || !open) return null;

        let metadata: any;
        try {
          metadata = await fetchFromPinata(metadataURI);
        } catch {
          metadata = { title: `Task #${postId}`, description: "Metadata unavailable" };
        }

        /* ---------------------- Flatten into Task ---------------------- */
        const task: Task = {
          id: postId,
          title: metadata.title ?? `Task #${postId}`,
          description: metadata.description ?? "No description available.",
          postedBy: metadata?.verse?.handle ? `@${metadata.verse.handle}` : "Unknown",
          postedTime: metadata?.createdAt
            ? new Date(metadata.createdAt).toLocaleDateString()
            : "Unknown",
          location: metadata.location ?? "unknown",
          timeEstimate: metadata.timeEstimate ?? null,
          budget: Number(TokenUtils.format(budgetMax, 18)),
          category: metadata.category ?? "general",
          serviceType: metadata.serviceType ?? "on-site",
          urgency: metadata.urgency ?? "medium",
          status: "open",
          skills: metadata.skills ?? [],
          rating: metadata.rating ?? 0,
          reviews: metadata.reviews ?? 0,
          coordinates: metadata.coordinates ?? {},
        };

        return task;
      } catch (err) {
        console.warn(`⚠️ Skipping post ${postId}:`, err);
        return null;
      }
    }

    /* ---------------------- Fetch all posts concurrently ---------------------- */
    const posts = await Promise.all(indices.map((id) => fetchPost(id)));

    /* ---------------------- Filter + sort + paginate ---------------------- */
    const filtered = posts
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .filter(
        (p:Task) =>
          (category === "all" || p.category === category) &&
          (location === "all" || p.location === location) &&
          (urgency === "all" || p.urgency === urgency) &&
          p.budget >= minBudget
      )
      .sort((a:Task, b:Task) => b.id - a.id);

    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / limit);
    const paginatedData = filtered.slice(
      (page - 1) * limit,
      (page - 1) * limit + limit
    );

    const payload = {
      data: paginatedData,
      total: totalFiltered,
      page,
      pages: totalPages,
      hasMore: !isFiltered && page * limit < totalFiltered,
    };

    cache.set(cacheKey, { data: payload, timestamp: Date.now() });
    return NextResponse.json(payload);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("❌ API Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
