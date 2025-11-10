import { verifyTypedData } from "viem";
import { ChainId } from "@verse/sdk";
import { getTypedDataTemplate, DappKey } from "val/utils/typedData";

/**
 * Verify a signed meta-tx payload for any Verse dApp (profile, job, lease, story).
 *
 * @param dapp - Which Verse app the data belongs to
 * @param chainId - Chain where it was signed
 * @param from - The signer address
 * @param message - The typed message (object to be verified)
 * @param signature - The user's EIP-712 signature
 * @returns boolean
 */
export async function verifyVerseSignature(
  dapp: DappKey,
  txType: typeof primaryType,
  chainId: ChainId,
  from: string,
  message: Record<string, any>,
  signature: string
): Promise<boolean> {
  try {
    const typedData = getTypedDataTemplate(dapp, chainId);

    const isValid = await verifyTypedData({
      ...typedData,
      address: from as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    return isValid;
  } catch (err) {
    console.error("❌ Typed data verification failed:", err);
    return false;
  }
}
