import { fetchFromPinata } from "@verse/sdk/services/storage";
import { type VerseProfile } from "@verse/sdk";

export async function parseVerseProfile(
  raw: any,
  verseId: number,
  address?: string
): Promise<VerseProfile | null> {
  if (!raw) return null;

  const {
    owner,
    handle,
    metadataURI,
    purpose,
    version,
    delegate,
    verified,
    createdAt,
  } = raw;

  // Must be IPFS
  if (!metadataURI?.startsWith("ipfs://")) {
    return null;
  }

  try {
    const json = await fetchFromPinata(metadataURI);

    const profile: VerseProfile = {
      verseId,
      handle: handle || json?.handle || "",
      displayName: json?.displayName || handle || "",
      avatar: json?.avatar,
      banner: json?.banner,
      bio: json?.bio || "",
      purpose: purpose || json?.purpose || "",
      owner,
      verified,
      reputation: json?.reputation || 0,
      location: json?.location || "",
      joinedAt:
        json?.joinedAt || new Date(Number(createdAt) * 1000).toISOString(),

      interests: json?.interests || [],
      links: {
        x: json?.links?.x || "",
        github: json?.links?.github || "",
        telegram: json?.links?.telegram || "",
        website: json?.links?.website || "",
        farcaster: json?.links?.farcaster || "",
      },

      personas: {
        hirecore: json?.personas?.hirecore || undefined,
        vaultoflove: json?.personas?.vaultoflove || undefined,
        leasevault: json?.personas?.leasevault || undefined,
        echain: json?.personas?.echain || undefined,
        ...(json?.personas || {}),
      },

      avatarPreview: undefined,
      previousAvatarURL: json?.avatar,
    };

    return profile;
  } catch (err) {
    console.error("Failed to parse profile:", err);
    return null;
  }
}
