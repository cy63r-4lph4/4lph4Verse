import { NextResponse } from "next/server";
import { type ChainId } from "@verse/sdk/utils/contract/deployedContracts";
import { relayTaskIntent } from "@verse/sdk/relay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, signature, chainId } = body;

    if (!data || !signature || !chainId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const relayerKey = process.env.NEXT_PRIVATE_RELAYER_KEY as `0x${string}`;
    if (!relayerKey) {
      throw new Error("Relayer private key not configured");
    }

    const txHash = await relayTaskIntent({
      chainId: chainId as ChainId,
      relayerKey,
      data,
      signature,
    });

    return NextResponse.json({ success: true, txHash });
  } catch (err: unknown) {
    console.error("❌ [Relay Task Error]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
