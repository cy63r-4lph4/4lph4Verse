import { ChainId, PROFILE_CHAIN } from "@verse/sdk";
import { RelayableContract } from "val/utils/relayableTxTypes";

export function getContractChain(contract: RelayableContract, chanId: ChainId) {
  switch (contract) {
    case "VerseProfile":
      return PROFILE_CHAIN;
    default:
      return chanId;
  }
}
