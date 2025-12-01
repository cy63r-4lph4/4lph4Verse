// services/pinata/buildProfileMetadata.ts
export function buildProfileMetadata({
  handle,
  displayName,
  bio,
  avatarURL,
  personas,
}: {
  handle: string;
  displayName: string;
  bio?: string;
  avatarURL?: string | null;
  personas?: Record<string, any>;
}) {
  const metadata: Record<string, any> = {
    handle,
    displayName,
    bio: bio || "",
    extras: personas || {},
    version: "1.0.0",
    createdAt: new Date().toISOString(),
  };

  if (avatarURL) {
    metadata.avatar = avatarURL;
  }

  return metadata;
}
