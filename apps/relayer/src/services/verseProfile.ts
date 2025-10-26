// apps/relayer/src/services/verseProfile.ts
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { getChainConfig, getContract } from "../config/chains";
import { ChainId } from "@verse/sdk";

const account = privateKeyToAccount(
  process.env.RELAYER_PRIVATE_KEY as `0x${string}`
);

export async function verseProfileWrite(
  chainId: ChainId,
  functionName: "createProfile",
  args: readonly unknown[]
) {
  const { chain, transport } = getChainConfig(chainId);
  const contract = getContract(chainId, "VerseProfile");

  const client = createWalletClient({
    account,
    chain,
    transport,
  });

  return client.writeContract({
    address: contract.address,
    abi: contract.abi,
    functionName,
    args,
    account,
  });
}
