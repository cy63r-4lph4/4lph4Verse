// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { getDeployedContract, ChainId } from "@verse/sdk/utils/contract/deployedContracts";
import { celoSepolia, fetchTaskById } from "@verse/hirecore-web/lib/taskService";

const PAGE_SIZE = 6;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const chainId = Number(searchParams.get("chainId")) || 11142220;
  const category = searchParams.get("category") ?? "all";
  const location = searchParams.get("location") ?? "all";
  const urgency = searchParams.get("urgency") ?? "all";
  const minBudget = Number(searchParams.get("minBudget") ?? 0);
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const limit = Math.max(Number(searchParams.get("limit") ?? PAGE_SIZE), 1);

  try {
    const jobBoard = getDeployedContract(chainId as ChainId, "HireCoreJobBoard");
    const client = createPublicClient({
      chain: celoSepolia,
      transport: http(celoSepolia.rpcUrls.default.http[0]),
    });

    const postCount = (await client.readContract({
      ...jobBoard,
      functionName: "nextPostId",
    })) as bigint;

    const totalPosts = Number(postCount) - 1;
    if (totalPosts <= 0) {
      return NextResponse.json({ data: [], total: 0, page, pages: 0 });
    }

    const start = totalPosts - (page - 1) * limit;
    const ids = Array.from({ length: limit }, (_, i) => start - i).filter((id) => id > 0);

    const posts = await Promise.all(ids.map((id) => fetchTaskById(id, chainId as ChainId).catch(() => null)));
    const filtered = posts
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (location === "all" || p.location === location) &&
          (urgency === "all" || p.urgency === urgency) &&
          p.budget >= minBudget
      );

    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / limit);

    const payload = {
      data: filtered,
      total: totalFiltered,
      page,
      pages: totalPages,
      hasMore: page < totalPages,
    };

    return NextResponse.json(payload);
  } catch (err) {
    console.error("❌ API Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
