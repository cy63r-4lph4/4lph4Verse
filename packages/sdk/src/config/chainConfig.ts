import type { ChainId } from "@verse/sdk";
import { celo, celoSepolia, baseSepolia, liskSepolia } from "viem/chains";
import type { Chain } from "viem";


// -----------------------------
// 1.  chain objects
// -----------------------------
export type VerseChain = Chain & {
  icon: string;
  gradient: string;
};

export const CHAIN_OBJECTS = {
  11142220: {
    ...celoSepolia,
    icon: "/chains/celo.svg",
    gradient: "from-yellow-400 to-orange-500",
  },
  84532: {
    ...baseSepolia,
    icon: "/chains/base.svg",
    gradient: "from-indigo-400 to-blue-500",
  },
  4202: {
    ...liskSepolia,
    icon: "/chains/lisk.svg",
    gradient: "from-purple-400 to-pink-500",
  },
  42220: {
    ...celo,
    icon: "/chains/celo.svg",
    gradient: "from-yellow-500 to-yellow-600",
  },
} satisfies Record<ChainId, VerseChain>;

// -----------------------------
// 2. RPC configuration
// -----------------------------
type configType={ name: string; rpcUrl: string ,icon:string}
export const CHAIN_CONFIG: Record<ChainId, configType> = {
  11142220: {
    name: "Celo Sepolia",
    rpcUrl: process.env.CELO_SEPOLIA_RPC!,
    icon:"",
  },
  84532: {
    name: "Base Sepolia",
    rpcUrl: process.env.BASE_SEPOLIA_RPC!,
    icon:""
  },
  4202: {
    name: "Lisk Sepolia",
    rpcUrl: process.env.LISK_SEPOLIA_RPC!,
    icon:""
  },
  42220: {
    name: "Celo",
    rpcUrl: process.env.CELO_RPC!,
    icon:""
  },
};

export function getChains() {
  const test = process.env.NEXT_PUBLIC_TEST!;
  if (test) {
    return [11142220, 84532, 4202];
  } else {
    return [42220];
  }
}
