import { ChainId, getDeployedContract, PROFILE_CHAIN } from "@verse/sdk";
import { RelayableContract } from "val/utils/relayableTxTypes";

export function getContractChain(contract: RelayableContract, chainId: ChainId) {
  switch (contract) {
    case "VerseProfile": {
      const address = getDeployedContract(PROFILE_CHAIN, contract);
      return { chain: PROFILE_CHAIN, address };
    }
    default: {
      const address = getDeployedContract(chainId, contract);
      return { chain: chainId, address };
    }
  }
}
