import { defineChain } from "viem";

export const chains = {
  celoSepolia: defineChain({
    id: 11142220,
    name: "Celo Sepolia",
    nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
    rpcUrls: {
      default: { http: ["https://forno.celo-sepolia.celo-testnet.org"] },
    },
    blockExplorers: {
      default: { name: "Celo Sepolia Blockscout", url: "https://celo-sepolia.blockscout.com" },
    },
  }),
  liskSepolia: defineChain({
    id: 4202,
    name: "Lisk Sepolia",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["https://rpc.sepolia.lisk.com"] },
    },
    blockExplorers: {
      default: { name: "Lisk Explorer", url: "https://sepolia-blockscout.lisk.com" },
    },
  }),
};
