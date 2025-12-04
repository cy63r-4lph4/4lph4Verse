import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { chains } from "./chains";

/**
 * Returns a typed Viem public client for reading
 */
export function getPublicClient(chainId: number): ReturnType<typeof createPublicClient> {
  const chain = Object.values(chains).find((c) => c.id === chainId);
  if (!chain) throw new Error(`Unsupported chainId ${chainId}`);

  return createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
  });
}

/**
 * Returns a typed Viem wallet client for relaying
 */
export function getWalletClient(
  chainId: number,
  privateKey: `0x${string}`
): ReturnType<typeof createWalletClient> {
  const chain = Object.values(chains).find((c) => c.id === chainId);
  if (!chain) throw new Error(`Unsupported chainId ${chainId}`);

  const account = privateKeyToAccount(privateKey);
  return createWalletClient({
    chain,
    account,
    transport: http(chain.rpcUrls.default.http[0]),
  });
}
