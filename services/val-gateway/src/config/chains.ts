import { ChainId } from "@verse/sdk";
import { 
  createPublicClient, 
  createWalletClient, 
  http 
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {CHAIN_CONFIG,CHAIN_OBJECTS} from "@verse/sdk"


// -----------------------------
// 3. makeClients()
// -----------------------------
export function makeClients(chainId: ChainId) {
  const cfg = CHAIN_CONFIG[chainId];
  const chainObj = CHAIN_OBJECTS[chainId];

  if (!cfg || !chainObj) {
    throw new Error(`Unsupported chainId: ${chainId}`);
  }

  const relayer = privateKeyToAccount(
    process.env.RELAYER_PRIVATE_KEY as `0x${string}`
  );

  const publicClient = createPublicClient({
    chain: chainObj,
    transport: http(cfg.rpcUrl),
  });

  const walletClient = createWalletClient({
    account: relayer,
    chain: chainObj,
    transport: http(cfg.rpcUrl),
  });

  return { cfg, publicClient, walletClient, relayer };
}
