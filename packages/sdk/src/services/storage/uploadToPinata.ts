import { uploadFileToPinata } from "@verse/sdk/services/storage/uploadFile";

/**
 * Uploads profile metadata (with avatar reference) to Pinata/IPFS.
 * Automatically ignores local/public fallback images.
 */
export async function uploadProfileToPinata(profile: {
  handle: string;
  displayName: string;
  bio?: string;
  avatar?: File | string;
  extras?: Record<string, any>;
}) {
  let avatarCID: string | null = null;
  let avatarURL: string | null = null;

  // 🧩 1️⃣ Upload avatar only if it's a real file (user-uploaded)
  if (profile.avatar && profile.avatar instanceof File) {
    const { cid } = await uploadFileToPinata(profile.avatar, "avatar");
    avatarCID = cid;
    avatarURL = `ipfs://${cid}`;
  }

  // 🧩 2️⃣ If it's a string, ensure it's not a local/public path
  else if (typeof profile.avatar === "string") {
    const isLocalAsset =
      profile.avatar.startsWith("/") ||                
      profile.avatar.includes("images/") ||           
      profile.avatar.startsWith("http://localhost") ||
      profile.avatar.startsWith("blob:") ||          
      profile.avatar.endsWith(".png") ||              
      profile.avatar.endsWith(".jpg") ||
      profile.avatar.endsWith(".jpeg");

    // Only use if it's an IPFS or remote URL (not local/public)
    if (!isLocalAsset || profile.avatar.startsWith("ipfs://")) {
      avatarURL = profile.avatar;
    }
  }

  // 🧩 3️⃣ Construct metadata JSON (omit avatar if fallback)
  const metadata: Record<string, any> = {
    handle: profile.handle,
    displayName: profile.displayName,
    bio: profile.bio || "",
    extras: profile.extras || {},
    version: "1.0.0",
    createdAt: new Date().toISOString(),
  };

  if (avatarURL) {
    metadata.avatar = avatarURL;
  }

  // 🧩 4️⃣ Upload metadata JSON to Pinata
  const file = new File(
    [JSON.stringify(metadata, null, 2)],
    `${profile.handle}_profile.json`,
    { type: "application/json" }
  );

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "profile");
  formData.append("name", profile.handle);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Profile metadata upload failed: ${err}`);
  }

  const { cid, url } = await res.json();

  return {
    metadataCID: cid,
    metadataURI: `ipfs://${cid}`,
    metadataURL: url,
    avatarCID,
    avatarURL,
  };
}
