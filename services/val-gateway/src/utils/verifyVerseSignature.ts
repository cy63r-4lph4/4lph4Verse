import { verifyTypedData } from "viem";
import { ChainId } from "@verse/sdk";
import {
  RelayableContract,
  RelayableFunction,
  RelayableTxTypes,
} from "../utils/relayableTxTypes";
import { getContractChain } from "../utils/contractChain";

type RelayableTxInfo<
  C extends RelayableContract,
  F extends RelayableFunction<C>,
> = (typeof RelayableTxTypes)[C][F];

export async function verifyVerseSignature<
  C extends RelayableContract,
  F extends RelayableFunction<C>,
>(
  contract: C,
  fn: F,
  chainId: ChainId,
  from: string,
  message: Record<string, any>,
  signature: string
): Promise<boolean> {
  try {
    // ⛓ Get the relayable metadata for this contract/function
    const relayInfo = RelayableTxTypes[contract][fn] as {
      primaryType: string;
      types: Record<string, { name: string; type: string }[]>;
    };

    const { chain, address } = getContractChain(contract, chainId);

    // 🔧 Build the full typed data dynamically
    const typedData = {
      domain: {
        name: contract,
        version: "1",
        chainId: chain,
        verifyingContract: address,
      },
      types: relayInfo.types,
      primaryType: relayInfo.primaryType,
      message,
    } as const;

    const isValid = await verifyTypedData({
      ...typedData,
      address: from as `0x${string}`,
      signature: signature as `0x${string}`,
    });

    return isValid;
  } catch (err) {
    console.error("❌ Typed data verification failed:", err);
    return false;
  }
}
