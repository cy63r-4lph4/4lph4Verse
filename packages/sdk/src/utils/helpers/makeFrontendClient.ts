import { CHAIN_OBJECTS } from "@verse/sdk/config/chainConfig";
import { CHAIN_CONFIG } from "@verse/sdk/config/chainConfig";
import { createPublicClient, http } from "viem";
import type { ChainId } from "@verse/sdk/utils/contract/deployedContracts";

export function makeFrontendPublicClient(chainId: ChainId) {
  return createPublicClient({
    chain: CHAIN_OBJECTS[chainId],
    transport: http(CHAIN_CONFIG[chainId].rpcUrl),
  });
}
