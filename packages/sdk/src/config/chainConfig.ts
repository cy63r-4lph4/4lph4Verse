import { ChainId } from "../utils/contract/deployedContracts";
import { celoSepolia, baseSepolia, liskSepolia } from "viem/chains";

// -----------------------------
// 1. Define your chain objects
// -----------------------------
export const CHAIN_OBJECTS: Record<ChainId, any> = {
  11142220: celoSepolia,
  84532: baseSepolia,
  4202: liskSepolia,
};

// -----------------------------
// 2. RPC configuration
// -----------------------------
export const CHAIN_CONFIG: Record<ChainId, { name: string; rpcUrl: string }> = {
  11142220: {
    name: "Celo Sepolia",
    rpcUrl: process.env.CELO_SEPOLIA_RPC!,
  },
  84532: {
    name: "Base Sepolia",
    rpcUrl: process.env.BASE_SEPOLIA_RPC!,
  },
  4202: {
    name: "Lisk Sepolia",
    rpcUrl: process.env.LISK_SEPOLIA_RPC!,
  },
};
