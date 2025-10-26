// apps/relayer/src/services/verseProfile.ts
import { ChainId, getDeployedContract } from "@verse/sdk";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo } from "viem/chains";

const account = privateKeyToAccount(process.env.RELAYER_PRIVATE_KEY as `0x${string}`);
const chainId = Number(process.env.CHAIN_ID) as ChainId;

// pull address + abi from your shared SDK
const vp = getDeployedContract(chainId, "VerseProfile");
const verseProfileAddress = vp.address;
const verseProfileAbi = vp.abi;

const client = createWalletClient({
  account,
  chain: celo,
  transport: http(process.env.RPC_URL),
});

// thin wrapper for contract writes
export async function verseProfileWrite(
  functionName: "createProfile",
  args: readonly unknown[],
) {
  return client.writeContract({
    abi: verseProfileAbi,
    address: verseProfileAddress,
    functionName,
    args,
    account,
  });
}
