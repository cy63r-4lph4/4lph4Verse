import { CHAIN_OBJECTS } from "config/chainConfig";
import { CHAIN_CONFIG } from "config/chainConfig";
import { createPublicClient, http } from "viem";
import { ChainId } from "utils/contract/deployedContracts";

export function makeFrontendPublicClient(chainId: ChainId) {
    return createPublicClient({
      chain: CHAIN_OBJECTS[chainId],
      transport: http(CHAIN_CONFIG[chainId].rpcUrl),
    });
  }
  