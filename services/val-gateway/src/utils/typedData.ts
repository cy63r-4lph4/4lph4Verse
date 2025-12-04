import { ChainId, getDeployedContract, PROFILE_CHAIN } from "@verse/sdk";
import { RelayableContract, RelayableTxTypes } from "../utils/relayableTxTypes";

/**
 * Supported dApps for typed-data schema resolution.
 */

/**
 * Returns the proper EIP-712 domain + type definitions
 * for any supported Verse sub-system (profile, job, lease, story).
 */
export function getTypedDataTemplate(
  contract: RelayableContract,
  chainId: ChainId
) {
  switch (contract) {
    /* -------------------------------------------------------------------------- */
    /* VerseProfile (root identity)                                               */
    /* -------------------------------------------------------------------------- */
    case "VerseProfile": {
      const { address } = getDeployedContract(PROFILE_CHAIN, "VerseProfile");

      return {
        domain: {
          name: "VerseProfile",
          version: "1",
          chainId: PROFILE_CHAIN,
          verifyingContract: address,
        },
        types:RelayableTxTypes,
        primaryType: "ProfileWithSig",
      };
    }

    /* -------------------------------------------------------------------------- */
    /* HireCore (Job system) — placeholder for now                                */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /* LeaseVault (Property listings) — placeholder                               */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /* VaultOfLove (Story publishing) — placeholder                               */
    /* -------------------------------------------------------------------------- */

    default:
      throw new Error(`Unsupported protocol key: ${contract}`);
  }
}
