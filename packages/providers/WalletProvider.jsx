"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { celo, celoSepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
export const config = createConfig({
    chains: [celoSepolia, celo],
    transports: {
        [celoSepolia.id]: http(),
        [celo.id]: http(),
    },
});
const queryClient = new QueryClient();
export function Web3Provider({ children }) {
    return (<WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>);
}
