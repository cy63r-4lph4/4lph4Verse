import { getStorachaClient } from "./client";

// Upload a JSON object
export async function uploadJson(obj: Record<string, any>): Promise<string> {
  const client = await getStorachaClient();
  const file = new File([JSON.stringify(obj)], "data.json", {
    type: "application/json",
  });
  const cid = await client.uploadFile(file);
  return `ipfs://${cid}`;
}

// Upload a single file (avatar, attachment, etc.)
export async function uploadFile(file: File): Promise<string> {
  const client = await getStorachaClient();
  const cid = await client.uploadFile(file);
  return `ipfs://${cid}`;
}

// Upload multiple files (metadata + image, job description docs, etc.)
export async function uploadDirectory(files: File[]): Promise<string> {
  const client = await getStorachaClient();
  const cid = await client.uploadDirectory(files);
  return `ipfs://${cid}`;
}
