// apps/relayer/src/utils/profileTypedData.ts
import { ChainId, getDeployedContract } from "../contract/deployedContracts";

export function buildProfileTypedData(chainId: ChainId) {
  const { address } = getDeployedContract(chainId, "VerseProfile");

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
