/**
 * Fetch a JSON or binary file from IPFS using your Pinata gateway
 * with optional fallback gateways.
 *
 * Supports public and private gateways.
 */
export async function fetchFromPinata(
  ipfsURI: string,
  options?: RequestInit
): Promise<any> {
  if (!ipfsURI) throw new Error("No IPFS URI provided");

  // 🧠 Normalize the CID or ipfs:// path
  const cid = ipfsURI.replace(/^ipfs:\/\//, "").replace(/^ipfs\//, "");

  // 🔐 Primary gateway (from .env)
  const gatewayDomain = process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN;
const url = `https://${gatewayDomain}/ipfs`;
  const primaryGateway =
    url ||
    "https://gateway.pinata.cloud/ipfs";

  // 🔁 Backup gateways (resilient fallback)
  const gateways = [
    `${primaryGateway}/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
  ];

  let lastError: any = null;

  for (const url of gateways) {
    try {
      const res = await fetch(url, {
        ...options,
        // Pinata sometimes requires CORS headers, so we always use `cors`
        mode: "cors",
        headers: {
          Accept: "application/json, text/plain, */*",
          ...options?.headers,
        },
      });

      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          return await res.json();
        } else if (contentType.startsWith("image/")) {
          return await res.blob();
        } else {
          return await res.text();
        }
      } else {
        lastError = new Error(`Gateway responded ${res.status}: ${url}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to fetch from any gateway for ${cid}`);
}
