/**
 * IRecoveryModule — Provider-agnostic interface for on-chain recovery module operations.
 *
 * STATUS: Interface only. No provider selected. Implementation is BLOCKED
 * pending explicit user approval to proceed with recovery module selection.
 *
 * The recovery module (Rhinestone's UniversalEmailRecoveryModule or Candide's
 * SocialRecoveryModule — pending audit review and Kernel v3.1 compatibility verification)
 * handles all social recovery logic on-chain.
 *
 * The backend uses this interface to:
 *   1. Build and relay calldata for guardian registration
 *   2. Monitor recovery state by observing on-chain events
 *   3. Relay the final executeRecovery call after timelock expires
 *
 * CRITICAL: The backend MUST NOT use this interface to bypass the on-chain recovery flow.
 *
 * INV-10: Recovery is enforced by the on-chain smart contract, not the backend.
 * INV-11: The backend MUST NOT be able to complete recovery alone.
 *          (guardians must independently call approveRecovery on-chain)
 *
 * @see Architecture v6 §8 (Recovery Model)
 */
export interface IRecoveryModule {
  /**
   * Encodes the calldata to install the recovery module on a smart account.
   * This is passed to `account.installModule(MODULE_TYPE_EXECUTOR, recoveryModuleAddr, data)`.
   *
   * Must be authorized by the root validator (passkey) in a UserOperation.
   *
   * @param guardians - Array of guardian EOA or contract addresses
   * @param threshold - Minimum number of guardian approvals required
   * @param timelockSeconds - Recovery timelock in seconds (e.g., 72 * 3600)
   * @returns ABI-encoded data for installModule
   */
  encodeInstallData(
    guardians: string[],
    threshold: number,
    timelockSeconds: number,
  ): `0x${string}`;

  /**
   * Returns the current recovery state for a smart account from on-chain data.
   *
   * @param accountAddress - The smart account address
   * @param chainId - The chain ID to query
   * @returns The current recovery status
   */
  getRecoveryStatus(
    accountAddress: string,
    chainId: number,
  ): Promise<{
    isRecoveryActive: boolean;
    approvalCount: number;
    threshold: number;
    timelockExpiresAt: Date | null;
  }>;

  /**
   * Encodes the calldata for executeRecovery — called after timelock expires.
   * The backend relays this call but DOES NOT authorize it (timelock is the authority).
   *
   * @param accountAddress - The smart account to execute recovery on
   * @param newValidatorType - Type of new validator ('passkey' | 'mpc' | 'hardware')
   * @param newValidatorData - ABI-encoded new validator public data
   * @returns Encoded calldata for executeRecovery
   */
  encodeExecuteRecovery(
    accountAddress: string,
    newValidatorType: string,
    newValidatorData: `0x${string}`,
  ): `0x${string}`;

  /** The deployed address of this recovery module on a given chain. */
  getModuleAddress(chainId: number): string | null;
}
