/**
 * 4lph4Verse Pinata Service
 * Unified uploader for both files and JSON metadata.
 * Detects type automatically and routes through /api/upload.
 */

export interface UploadResponse {
  cid: string;
  url: string;
  type?: string;
  name?: string;
}

/* --------------------------------------------------
 * 🔹 Upload File (Binary / Image / PDF / etc.)
 * -------------------------------------------------- */
export async function uploadFileToPinata(
  file: File,
  type: string = "generic"
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("name", file.name);
  const val_gateway = process.env.NEXT_PUBLIC_VAL_GATEWAY;
  console.log(val_gateway)

  const res = await fetch(`${val_gateway}/v1/pinata/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`File upload failed: ${err}`);
  }

  return res.json();
}

/* --------------------------------------------------
 * 🔹 Upload JSON Metadata (Profile, Task, NFT, etc.)
 * -------------------------------------------------- */
export async function uploadJsonToPinata(
  json: Record<string, any>,
  type: string = "generic"
): Promise<UploadResponse> {
  const blob = new Blob([JSON.stringify(json, null, 2)], {
    type: "application/json",
  });

  const file = new File([blob], `${type}_metadata.json`, {
    type: "application/json",
  });

  return uploadFileToPinata(file, type);
}

/* --------------------------------------------------
 * 🔹 Smart Auto Uploader
 * -------------------------------------------------- */
export async function uploadToPinata(
  payload:
    | { file: File; json?: never; type?: string }
    | { json: Record<string, any>; file?: never; type?: string }
): Promise<UploadResponse> {
  if ("file" in payload && payload.file instanceof File) {
    return uploadFileToPinata(payload.file, payload.type || "generic");
  }

  if ("json" in payload && typeof payload.json === "object") {
    return uploadJsonToPinata(payload.json, payload.type || "generic");
  }

  throw new Error("Invalid upload payload: provide either a file or json");
}

/* --------------------------------------------------
 * 🔹 Fetch From Pinata (Gateway)
 * -------------------------------------------------- */
async function fetchFromPinata(ipfsURI: string) {
  if (!ipfsURI) throw new Error("Missing IPFS URI");

  const gateway =
    process.env.NEXT_PUBLIC_PINATA_GATEWAY ||
    "https://gateway.pinata.cloud/ipfs/";
  const cid = ipfsURI.replace("ipfs://", "");
  const url = `${gateway}${cid}`;

  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Failed to fetch from Pinata: ${res.statusText}`);

  return res.json();
}
