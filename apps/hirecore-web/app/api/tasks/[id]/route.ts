import { NextResponse } from "next/server";
import { createPublicClient, http, defineChain } from "viem";
import { getDeployedContract, ChainId } from "@verse/sdk/utils/contract/deployedContracts";
import { fetchFromPinata } from "@verse/services/pinata";
import { TokenUtils } from "@verse/sdk/utils/token/tokenUtils";

// ✅ Chain config (same as in your tasks page)
export const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  network: "celo-sepolia",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://forno.celo-sepolia.celo-testnet.org"] },
  },
});

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; 
  const numericId = Number(id);

  if (!numericId) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }
  try {
    const chainId = 11142220 as ChainId;
    const jobBoard = getDeployedContract(chainId, "HireCoreJobBoard");

    const client = createPublicClient({
      chain: celoSepolia,
      transport: http(celoSepolia.rpcUrls.default.http[0]),
    });

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

    if (!res || res.length < 7) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const [hirer, paymentToken, budgetMax, expiry, deposit, metadataURI, open] = res;

    if (hirer === "0x0000000000000000000000000000000000000000")
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    let metadata;
    try {
      metadata = await fetchFromPinata(metadataURI);
    } catch {
      metadata = {};
    }

    const attachments = (metadata.attachments || []).map((a: any) => ({
      name: a.name || a.slice(7, 15) + "...",
      url: (typeof a === "string" ? a : a.url).replace(
        "ipfs://",
        "https://gateway.pinata.cloud/ipfs/"
      ),
      type: a.type || "unknown",
    }));

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
      metadataURI,
      createdAt: metadata.createdAt ?? null,
      open,
    };

    return NextResponse.json(task);
  } catch (err) {
    console.error("❌ Task fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}
