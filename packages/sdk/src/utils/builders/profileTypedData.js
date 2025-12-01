import { PROFILE_CHAIN } from "../../config/constants";
import { getDeployedContract } from "../contract/deployedContracts";
export function buildProfileTypedData(chainId) {
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
