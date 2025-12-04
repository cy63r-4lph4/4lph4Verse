import { CHAIN_OBJECTS } from "../../config/chainConfig";
import { CHAIN_CONFIG } from "../../config/chainConfig";
import { createPublicClient, http } from "viem";
export function makeFrontendPublicClient(chainId) {
    return createPublicClient({
        chain: CHAIN_OBJECTS[chainId],
        transport: http(CHAIN_CONFIG[chainId].rpcUrl),
    });
}
