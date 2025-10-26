import { ChainId, getDeployedContract } from "@verse/sdk";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo } from "viem/chains";

const account = privateKeyToAccount(process.env.RELAYER_PRIVATE_KEY as `0x${string}`);
const chainId = Number(process.env.CHAIN_ID) as ChainId;

const coreToken = getDeployedContract(chainId, "CoreToken");
const coreTokenAddress = coreToken.address;
const coreTokenAbi = coreToken.abi;

const client = createWalletClient({
  account,
  chain: celo,
  transport: http(process.env.RPC_URL),
});

export const coreTokenWrite = async (
  functionName: string,
  args: unknown[]
) => {
  return await client.writeContract({
    abi: coreTokenAbi,
    address: coreTokenAddress,
    functionName,
    args,
    account,
  });
};
