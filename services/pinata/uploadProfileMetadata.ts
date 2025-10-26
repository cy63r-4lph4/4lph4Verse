// services/pinata/uploadProfileMetadata.ts
export async function uploadProfileMetadata(metadata: any, handle: string) {
  const file = new File(
    [JSON.stringify(metadata, null, 2)],
    `${handle}_profile.json`,
    { type: "application/json" }
  );

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "profile");
  formData.append("name", handle);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Metadata upload failed: ${err}`);
  }

  return await res.json(); // { cid, url }
}
