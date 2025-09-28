// apps/hirecore-web/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStorachaClient } from "@verse/sdk/utils/storacha/client"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const client = await getStorachaClient();
    const file = new File(
      [JSON.stringify(body, null, 2)],
      "profile.json",
      { type: "application/json" }
    );

    const cid = await client.uploadFile(file);

    return NextResponse.json({
      cid,
      url: `https://${cid}.ipfs.storacha.link/profile.json`,
    });
  } catch (e: any) {
    console.error("Storacha upload failed:", e);
    return NextResponse.json(
      { error: e?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}
