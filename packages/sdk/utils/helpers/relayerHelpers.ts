import {
  RelayableContract,
  RelayableTxTypes,
} from "../contract/relayableTxTypes";
import { getDeployedContract } from "../contract/deployedContracts";
import { encodeFunctionData, keccak256, encodeAbiParameters } from "viem";
import { PROFILE_CHAIN } from "config/constants";

type CreateProfileOp = {
  owner: `0x${string}`;
  handle: string;
  metadataURI: string;
  purpose: string;
  nonce: bigint;
  deadline: bigint;
};

const verseProfile = getDeployedContract(PROFILE_CHAIN, "VerseProfile");

export function buildCreateProfileOp({
  owner,
  handle,
  metadataURI,
  purpose = "",
  nonce,
  deadline,
}: {
  owner: `0x${string}`;
  handle: string;
  metadataURI: string;
  purpose?: string;
  nonce: number | string | bigint;
  deadline: number | string | bigint;
}) {
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
export function buildTypedDataForCreateProfile({
  verifyingContract,
  op,
}: {
  verifyingContract: `0x${string}`;
  op: CreateProfileOp;
}) {
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
  } as const;
}

/**
 * Build calldata for createProfileWithSig(op, sig)
 */
export function buildCreateProfileCalldata(op: any, signature: `0x${string}`) {
  return encodeFunctionData({
    abi: verseProfile.abi,
    functionName: "createProfileWithSig",
    args: [op, signature],
  }) as `0x${string}`;
}
