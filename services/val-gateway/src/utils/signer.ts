import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo } from "viem/chains";

export const relayerAccount = privateKeyToAccount(
  process.env.RELAYER_PRIVATE_KEY as `0x${string}`
);

export const relayerClient = createWalletClient({
  account: relayerAccount,
  chain: celo, 
  transport: http(process.env.CELO_SEPOLIA_RPC!),
});