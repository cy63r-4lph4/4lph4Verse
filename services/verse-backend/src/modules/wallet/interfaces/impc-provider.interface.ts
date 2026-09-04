/**
 * IMPCProvider — Provider-agnostic interface for MPC key operations.
 *
 * This interface decouples the backend from any specific MPC provider
 * (e.g., Web3Auth MPC Core Kit, Fireblocks MPC, etc.).
 *
 * The MPC provider is responsible for:
 *   1. Participating in TSS distributed key generation (never reconstructing the full key)
 *   2. Co-signing transactions via threshold signing (never sending the full key)
 *   3. Deriving and exposing the TSS public key (as an Ethereum address) for on-chain registration
 *
 * INV-04: walletIdentitySeed MUST NEVER be stored by the backend.
 * INV-08: Authentication MUST NOT authorize fund movement — only the MPC module can co-sign.
 *
 * @see Architecture v6 §7 (Controller Types)
 */
export interface IMPCProvider {
  /**
   * Derives or retrieves the TSS public key for a given wallet identity.
   *
   * The public key is returned as a checksummed Ethereum address, which is the
   * form used as `controllerIdentifier` in wallet_controllers for MPC controllers.
   *
   * The private key is NEVER reconstructed or returned.
   *
   * @param walletIdentityId - The 0x-prefixed hex wallet identity anchor
   * @returns The TSS signing address (checksummed Ethereum address)
   */
  getTSSPublicKeyAddress(walletIdentityId: `0x${string}`): Promise<string>;

  /**
   * Signs a transaction hash using TSS (threshold signing).
   *
   * The full private key is NEVER assembled. Partial signatures from each
   * participating party are combined to produce a final ECDSA signature.
   *
   * @param walletIdentityId - The wallet whose TSS key participates in signing
   * @param txHash - The EIP-712 or raw transaction hash to sign
   * @returns The ECDSA signature (r, s, v) as a 0x-prefixed hex string
   */
  signTransactionHash(
    walletIdentityId: `0x${string}`,
    txHash: `0x${string}`,
  ): Promise<`0x${string}`>;

  /**
   * Returns whether this MPC provider is ready for the given wallet.
   * Used during wallet provisioning to gate controller registration.
   */
  isReady(walletIdentityId: `0x${string}`): Promise<boolean>;
}
