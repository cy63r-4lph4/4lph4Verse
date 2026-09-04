import type { ValidatorControllerType } from '../services/wallet-controller.service';

export class AddControllerDto {
  /** passkey | mpc | hardware — guardians are managed separately via wallet_guardians */
  controllerType: ValidatorControllerType;

  /**
   * The canonical identifier for this controller (type-dependent):
   *   passkey  → base64url WebAuthn credential ID
   *   mpc      → TSS public key as checksummed Ethereum address
   *   hardware → EOA address or WebAuthn credential ID
   */
  controllerIdentifier: string;

  /** ERC-7579 validator module address (required for all validator controller types). */
  validatorContractAddress?: string;

  /**
   * ABI-encoded public data for the on-chain validator:
   *   passkey → abi.encode(uint256 x, uint256 y)
   *   mpc/hw  → abi.encode(address)
   */
  onChainPublicData?: string;

  canSignTransactions?: boolean;
  canManageControllers?: boolean;
  canInitiateRecovery?: boolean;
}
