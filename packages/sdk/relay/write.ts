import { verifyTypedData, writeContract } from "viem/actions";
import { createPublicClient, http } from "viem";
import { getWalletClient } from "./client";
import { ChainId, getDeployedContract } from "../utils/contract/deployedContracts";
import { defineChain } from "viem";

// ✅ (Optional) define chain helper for dynamic RPC
function getChainConfig(chainId: ChainId) {
  switch (chainId) {
    case 11142220:
      return defineChain({
        id: 11142220,
        name: "Celo Sepolia",
        nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
        rpcUrls: {
          default: { http: ["https://forno.celo-sepolia.celo-testnet.org"] },
        },
      });
    // case 4202:
    //   return defineChain({
    //     id: 4202,
    //     name: "Lisk Sepolia",
    //     nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    //     rpcUrls: {
    //       default: { http: ["https://rpc.sepolia.lisk.com"] },
    //     },
    //   });
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}

/**
 * Relay a signed task intent to the blockchain
 *
 * @param chainId        Network chain ID
 * @param relayerKey     Private key of the relayer wallet
 * @param data           User-signed message data
 * @param signature      User's EIP-712 signature
 * @param contractName   Name of contract in deployed registry (default: "HireCoreJobBoard")
 */
export async function relayTaskIntent({
  chainId,
  relayerKey,
  data,
  signature,
  contractName = "HireCoreJobBoard",
}: {
  chainId: ChainId;
  relayerKey: `0x${string}`;
  data: {
    user: `0x${string}`;
    metadataURI: string;
    budget: string | bigint;
  };
  signature: `0x${string}`;
  contractName?: "HireCoreJobBoard" | "HireCoreJobManager";
}) {
  /* --------------------------------------------------
   * 1️⃣ Create public client for signature verification
   * -------------------------------------------------- */
  const chain = getChainConfig(chainId);
  const publicClient = createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
  });

  /* --------------------------------------------------
   * 2️⃣ Verify user's EIP-712 signature
   * -------------------------------------------------- */
  const typedMessage = {
  ...data,
  budget: BigInt(data.budget),
};
  const verified = await verifyTypedData(publicClient, {
    address: data.user,
    domain: {
      name: "HireCore",
      version: "1",
      chainId,
    },
    types: {
      TaskIntent: [
        { name: "user", type: "address" },
        { name: "metadataURI", type: "string" },
        { name: "budget", type: "uint256" },
      ],
    },
    primaryType: "TaskIntent",
    message: typedMessage,
    signature,
  });

  if (!verified) throw new Error("Invalid signature: EIP-712 verification failed");

  /* --------------------------------------------------
   * 3️⃣ Create relayer wallet client
   * -------------------------------------------------- */
  const walletClient = getWalletClient(chainId, relayerKey);

  /* --------------------------------------------------
   * 4️⃣ Load deployed contract (from registry)
   * -------------------------------------------------- */
  const contract = getDeployedContract(chainId, contractName);

  /* --------------------------------------------------
   * 5️⃣ Relay transaction via relayer wallet
   * -------------------------------------------------- */
  const txHash = await writeContract(walletClient, {
    address: contract.address,
    abi: contract.abi,
    chain: walletClient.chain,
    account: walletClient.account!,
    functionName: "createTaskFromRelayer",
    args: [data.metadataURI, BigInt(data.budget)],
  });

  return txHash;
}
