import { createPublicClient, createWalletClient, encodeFunctionData, http, verifyTypedData } from "viem";
import { writeContract } from "viem/actions";
import { defineChain, Hex } from "viem";
import type { Abi } from "viem";

export interface RelayRequest {
  chainId: number;
  user: `0x${string}`;
  contract: {
    address: `0x${string}`;
    abi: Abi;
    functionName: string;
    args: any[];
  };
  signature: Hex;
}

/* -------------------------------------------------------------
 * 1️⃣ Universal RPC Resolver (multi-chain aware)
 * ------------------------------------------------------------- */
function getChainConfig(chainId: number) {
  const registry: Record<number, any> = {
    11142220: defineChain({
      id: 11142220,
      name: "Celo Sepolia",
      nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
      rpcUrls: { default: { http: ["https://forno.celo-sepolia.celo-testnet.org"] } },
    }),
    4202: defineChain({
      id: 4202,
      name: "Lisk Sepolia",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: { default: { http: ["https://rpc.sepolia.lisk.com"] } },
    }),
  };

  const chain = registry[chainId];
  if (!chain) throw new Error(`Unsupported chain ID: ${chainId}`);
  return chain;
}

/* -------------------------------------------------------------
 * 2️⃣ Universal Relay Function
 * ------------------------------------------------------------- */
export async function relayTx({
  relayerKey,
  request,
}: {
  relayerKey: `0x${string}`;
  request: RelayRequest;
}) {
  const { chainId, user, contract, signature } = request;
  const chain = getChainConfig(chainId);

  /* 🧩 Setup clients */
  const publicClient = createPublicClient({ chain, transport: http(chain.rpcUrls.default.http[0]) });
  const walletClient = createWalletClient({
    account: relayerKey,
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
  });
const functionSigHash = encodeFunctionData({
  abi: contract.abi,
  functionName: contract.functionName,
  args: contract.args,
});

  /* 🔐 Step 1: Verify user signature */
 const typedData = {
  domain: { name: "4lphaVerse", version: "1", chainId },
  types: {
    RelayCall: [
      { name: "user", type: "address" },
      { name: "target", type: "address" },
      { name: "functionSigHash", type: "bytes" },
    ],
  },
  primaryType: "RelayCall",
  message: {
    user,
    target: contract.address,
    functionSigHash,
  },
};


   const verified = await publicClient.verifyTypedData({
  address: user,
  domain: typedData.domain,
  types: typedData.types,
  primaryType: "RelayCall",
  message: typedData.message,
  signature,
});


  if (!verified) throw new Error("❌ Invalid signature");

  /* 🚀 Step 2: Execute on-chain as relayer */
  const txHash = await writeContract(walletClient, {
  address: contract.address,
  abi: contract.abi,
  functionName: contract.functionName,
  args: contract.args,
  chain: walletClient.chain,     
  account: walletClient.account, 
});


  console.log(`✅ Relayed tx on chain ${chainId}: ${txHash}`);
  return txHash;
}
