import { pinata } from "@verse/sdk";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;
    const name = (data.get("name") as string) || "metadata";
    const type = (data.get("type") as string) || "json";

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const { cid } = await pinata.upload.public.file(file);

    const url = await pinata.gateways.public.convert(cid);

    return NextResponse.json(
      { cid, url: `${url}/${name}.${type}` },
      { status: 200 }
    );
  } catch (e: unknown) {
    console.error("Pinata upload failed:", e);
    
    let message = "Upload failed";
    if (e instanceof Error) {
      message = e.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

}
