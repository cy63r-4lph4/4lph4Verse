import { ChainId } from "@verse/sdk";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {celoSepolia,baseSepolia,liskSepolia} from "viem/chains"

export const CHAIN_CONFIG: Record<ChainId, { name: string; rpcUrl: string }> = {
    11142220: {
        name:"Celo Sepolia",
        rpcUrl: process.env.CELO_SEPOLIA_RPC!},
    84532: {
        name: "Base Sepolia",
        rpcUrl: process.env.BASE_SEPOLIA_RPC!
    },
    4202: {
        name: "Lisk Sepolia",
        rpcUrl: process.env.LISK_SEPOLIA_RPC!
    }
};

export function makeClients(chainId: ChainId) {
    const cfg= CHAIN_CONFIG[chainId];
    if(!cfg) {
        throw new Error(`Unsupported chainId: ${chainId}`);
    }
  const relayer = privateKeyToAccount(process.env.RELAYER_PRIVATE_KEY as `0x${string}`);
  const publicClient=createPublicClient({
    chain:chainId===11142220
    ?celoSepolia
    :chainId===84532
    ?baseSepolia
    :liskSepolia, transport:http(cfg.rpcUrl),

  }
)
const walletClient= createWalletClient({account:relayer,chain:publicClient.chain,transport:http(cfg.rpcUrl)})

return {cfg,publicClient,walletClient,relayer};
}