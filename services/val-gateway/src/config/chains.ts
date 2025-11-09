import { ChainId } from "@verse/sdk";

export const CHAIN_CONFIG: Record<ChainId, { name: string; rpcUrl: string }> = {
    11142220: {
        name:"Celo Sepolia",
        rpcUrl: process.env.CELO_SEPOLIA_RPC_URL!},
    84532: {
        name: "Base Sepolia",
        rpcUrl: process.env.BASE_SEPOLIA_RPC_URL!
    },
    4202: {
        name: "Lisk Sepolia",
        rpcUrl: process.env.LISK_SEPOLIA_RPC_URL!
    }
};

export function makeClients(chainId: ChainId) {}