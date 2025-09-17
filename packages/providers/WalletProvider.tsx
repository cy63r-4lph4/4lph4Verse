"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  baseSepolia,
  sepolia,
  celo,
  celoSepolia,
  celoAlfajores,
} from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

// Configure Wagmi + RainbowKit
const config = createConfig({
  chains: [celoSepolia, baseSepolia, sepolia, celo, celoAlfajores],
  transports: {
    [celoSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [sepolia.id]: http(),
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
