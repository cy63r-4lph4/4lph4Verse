import { ChainId } from "@verse/sdk";
import {
  celo,
  baseSepolia,
  liskSepolia,
} from "viem/chains";
import { http } from "viem";

// ✅ Map supported chains
export const supportedChains: Record<ChainId, any> = {
  11142220: celo,
  84532: baseSepolia,
  4202: liskSepolia,
};

// ✅ RPC URLs per chain (loaded from env)
export const rpcUrls: Record<ChainId, string> = {
  11142220: process.env.CELO_RPC_URL!,
  84532: process.env.BASE_RPC_URL!,
  4202: process.env.LISK_RPC_URL!,
};

// ✅ Helper: get chain + transport
export function getChainConfig(chainId: ChainId) {
  const chain = supportedChains[chainId];
  const rpcUrl = rpcUrls[chainId];
  if (!chain || !rpcUrl) throw new Error("Unsupported chain");
  return { chain, transport: http(rpcUrl) };
}
