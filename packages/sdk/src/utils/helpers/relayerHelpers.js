import { RelayableTxTypes, } from "../contract/relayableTxTypes";
import { getDeployedContract } from "../contract/deployedContracts";
import { encodeFunctionData } from "viem";
import { PROFILE_CHAIN } from "../../config/constants";
const verseProfile = getDeployedContract(PROFILE_CHAIN, "VerseProfile");
export function buildCreateProfileOp({ owner, handle, metadataURI, purpose = "", nonce, deadline, }) {
    return {
        owner,
        handle,
        metadataURI,
        purpose,
        nonce: BigInt(nonce), // NOT string
        deadline: BigInt(deadline), // NOT string
    };
}
/**
 * Build the EIP-712 typedData object expected for signing
 */
export function buildTypedDataForCreateProfile({ verifyingContract, op, }) {
    const meta = RelayableTxTypes.VerseProfile.createProfileWithSig;
    return {
        domain: {
            name: "VerseProfile",
            version: "1",
            chainId: PROFILE_CHAIN,
            verifyingContract,
        },
        types: meta.types,
        primaryType: meta.primaryType,
        message: op,
    };
}
/**
 * Build calldata for createProfileWithSig(op, sig)
 */
export function buildCreateProfileCalldata(op, signature) {
    return encodeFunctionData({
        abi: verseProfile.abi,
        functionName: "createProfileWithSig",
        args: [op, signature],
    });
}
