/**
 * fetchFromPinata.ts — Cached IPFS fetcher for the 4lph4Verse
 * ------------------------------------------------------------
 * - Resilient gateway fallback
 * - Works with JSON, text, and images
 * - Includes in-memory TTL cache to avoid refetching
 */

type CacheEntry = { data: any; timestamp: number };
const IPFS_CACHE = new Map<string, CacheEntry>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchFromPinata(
  ipfsURI: string,
  options?: RequestInit,
  ttl: number = DEFAULT_TTL
): Promise<any> {
  if (!ipfsURI) throw new Error("No IPFS URI provided");

  // Normalize the CID or ipfs:// path
  const cid = ipfsURI.replace(/^ipfs:\/\//, "").replace(/^ipfs\//, "");

  // --- Cache check ---
  const cached = IPFS_CACHE.get(cid);
  if (cached && Date.now() - cached.timestamp < ttl) {
    // 🧠 serve cached result instantly
    return cached.data;
  }

  // Determine gateway domain
  const gatewayDomain = process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN;
  const primaryGateway = gatewayDomain
    ? `https://${gatewayDomain}/ipfs`
    : "https://gateway.pinata.cloud/ipfs";

  const gateways = [
    `${primaryGateway}/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
  ];

  let lastError: any = null;

  for (const url of gateways) {
    try {
      const res = await fetch(url, {
        ...options,
        mode: "cors",
        headers: {
          Accept: "application/json, text/plain, */*",
          ...options?.headers,
        },
      });

      if (!res.ok) {
        lastError = new Error(`Gateway ${url} responded ${res.status}`);
        continue;
      }

      const contentType = res.headers.get("content-type") || "";
      let data: any;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else if (contentType.startsWith("image/")) {
        data = await res.blob();
      } else {
        data = await res.text();
      }

      // ✅ Store in cache
      IPFS_CACHE.set(cid, { data, timestamp: Date.now() });

      return data;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to fetch from any gateway for ${cid}`);
}

/** Optional helper: clear cache manually */
export function clearIpfsCache(cid?: string) {
  if (cid) IPFS_CACHE.delete(cid);
  else IPFS_CACHE.clear();
}
