// apps/relayer/src/utils/profileTypedData.ts
import { ChainId, getDeployedContract } from "@verse/sdk";

const chainId = Number(process.env.CHAIN_ID) as ChainId;
const verseProfile = getDeployedContract(chainId, "VerseProfile");

export const profileTypedData = {
  domain: {
    name: "VerseProfile",
    version: "1",
    chainId,
    verifyingContract: verseProfile.address,
  },
  types: {
    CreateProfile: [
      { name: "wallet", type: "address" },
      { name: "handle", type: "string" },
      { name: "metadataURI", type: "string" },
    ],
  },
};
