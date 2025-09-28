// packages/sdk/profile/lib/uploadToStoracha.ts
export async function uploadProfileToStoracha(profile: any) {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    throw new Error("Upload to Storacha failed");
  }

  return res.json(); // { cid, url }
}
