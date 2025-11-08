import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { getChainConfig } from "../config/chains";
import { ChainId, getDeployedContract } from "@verse/sdk";

const account = privateKeyToAccount(
  process.env.RELAYER_PRIVATE_KEY as `0x${string}`
);

export async function verseProfileWrite(
  chainId: ChainId,
  functionName: "createProfile",
  args: readonly unknown[]
) {
  // ✅ configure chain & rpc
  const { chain, transport } = getChainConfig(chainId);

  // ✅ always fetch correct contract for this chain
  const contract = getDeployedContract(chainId, "VerseProfile");

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
