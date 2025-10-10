export async function uploadFileToPinata(file: File, type: string = "generic") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("name", file.name);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`File upload failed: ${err}`);
  }

  return res.json(); // { cid, url, type, name }
}
