import { createWalletClient, http, type WalletClient } from "viem";
import { type Account, privateKeyToAccount } from "viem/accounts";
import { celo } from "viem/chains";

export const relayerAccount: Account = privateKeyToAccount(
  process.env.RELAYER_PRIVATE_KEY as `0x${string}`
);

export const relayerClient: WalletClient = createWalletClient({
  account: relayerAccount,
  chain: celo,
  transport: http(process.env.CELO_SEPOLIA_RPC!),
});
