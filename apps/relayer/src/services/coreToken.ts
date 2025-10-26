import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { getChainConfig } from "../config/chains";
import { ChainId, getDeployedContract } from "@verse/sdk";

const account = privateKeyToAccount(
  process.env.RELAYER_PRIVATE_KEY as `0x${string}`
);

export async function coreTokenWrite(
  chainId: ChainId,
  functionName: "permit",
  args: readonly unknown[]
) {
  const { chain, transport } = getChainConfig(chainId);
  const token = getDeployedContract(chainId, "CoreToken");

  const client = createWalletClient({
    account,
    chain,
    transport,
  });

  return client.writeContract({
    abi: token.abi,
    address: token.address,
    functionName,
    args,
    account,
  });
}
