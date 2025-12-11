import { PROFILE_CHAIN } from "@verse/sdk/config/constants";
import { type ChainId, getDeployedContract } from "@verse/sdk/utils/contract/deployedContracts";

export function buildProfileTypedData(chainId: ChainId) {
  const { address } = getDeployedContract(PROFILE_CHAIN, "VerseProfile");

  return {
    domain: {
      name: "VerseProfile",
      version: "1",
      chainId,
      verifyingContract: address,
    },
    types: {
      CreateProfile: [
        { name: "wallet", type: "address" },
        { name: "handle", type: "string" },
        { name: "metadataURI", type: "string" },
      ],
    },
    primaryType: "CreateProfile",
  };
}
