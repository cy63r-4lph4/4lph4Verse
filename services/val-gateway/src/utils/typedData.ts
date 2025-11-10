import { ChainId, getDeployedContract, PROFILE_CHAIN } from "@verse/sdk";

/**
 * Supported dApps for typed-data schema resolution.
 */
export type DappKey = "profile" | "job" | "lease" | "story";

/**
 * Returns the proper EIP-712 domain + type definitions
 * for any supported Verse sub-system (profile, job, lease, story).
 */
export function getTypedDataTemplate(dapp: DappKey, chainId: ChainId) {
  switch (dapp) {
    /* -------------------------------------------------------------------------- */
    /* VerseProfile (root identity)                                               */
    /* -------------------------------------------------------------------------- */
    case "profile": {
      const { address } = getDeployedContract(PROFILE_CHAIN, "VerseProfile");

      return {
        domain: {
          name: "VerseProfile",
          version: "1",
          chainId: PROFILE_CHAIN, // or chainId if you ever deploy multi-chain
          verifyingContract: address,
        },
        types: {
          CreateProfileWithSig: [
            { name: "owner", type: "address" },
            { name: "handle", type: "string" },
            { name: "metadataURI", type: "string" },
            { name: "purpose", type: "string" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
          SetURIWithSig: [
            { name: "verseId", type: "uint256" },
            { name: "metadataURI", type: "string" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
          SetDelegateWithSig: [
            { name: "verseId", type: "uint256" },
            { name: "newDelegate", type: "address" },
            { name: "isApproved", type: "bool" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
          SetPurposeWithSig: [
            { name: "verseId", type: "uint256" },
            { name: "newPurpose", type: "string" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
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
      throw new Error(`Unsupported dapp key: ${dapp}`);
  }
}
