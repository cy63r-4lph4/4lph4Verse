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
  } catch (e: unknown) {
  console.error("Storacha upload failed:", e);

  let message = "Upload failed";
  if (e instanceof Error) {
    message = e.message;
  }

  return NextResponse.json({ error: message }, { status: 500 });
}

}
