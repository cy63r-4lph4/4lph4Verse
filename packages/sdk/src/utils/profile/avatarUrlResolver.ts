/**
 * Resolves a profile avatar URL to a usable HTTP(S) link.
 * Supports IPFS (ipfs://) and normal URLs.
 * Returns null if the input is falsy.
 */
export function resolveAvatarUrl(avatar?: string | null): string | null {
  if (!avatar) return null;

  if (avatar.startsWith("ipfs://")) {
    // Replace IPFS scheme with Pinata gateway
    return avatar.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  }

  // Otherwise, assume it’s already a usable URL
  return avatar;
}
