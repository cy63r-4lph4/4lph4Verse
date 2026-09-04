import { encodePacked, keccak256, pad } from 'viem';

export const GUARDIAN_APPROVAL_TYPES = {
  GuardianApproval: [
    { name: 'verseId', type: 'uint256' },
    { name: 'action', type: 'bytes32' },
    { name: 'paramsHash', type: 'bytes32' },
    { name: 'guardianEpoch', type: 'uint64' },
    { name: 'recoveryNonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};

// Hardcoded actions derived from the contract `keccak256("ACTION_NAME")`
export const GUARDIAN_ACTIONS = {
  HARD_FREEZE: keccak256(new TextEncoder().encode("HARD_FREEZE")),
  UNFREEZE: keccak256(new TextEncoder().encode("UNFREEZE")),
  RECOVERY_INIT: keccak256(new TextEncoder().encode("RECOVERY_INIT")),
  RECOVERY_EXECUTE: keccak256(new TextEncoder().encode("RECOVERY_EXECUTE")),
  RECOVERY_CANCEL: keccak256(new TextEncoder().encode("RECOVERY_CANCEL")),
} as const;

export type GuardianApprovalData = {
  verseId: bigint;
  action: `0x${string}`;
  paramsHash: `0x${string}`;
  guardianEpoch: bigint;
  recoveryNonce: bigint;
  deadline: bigint;
};

/**
 * Builds the EIP-712 typed data payload for a guardian to sign.
 * @param domain - The EIP-712 domain object (from the contract)
 * @param message - The GuardianApprovalData containing dynamic nonces and constants
 * @returns The typed data ready to be passed to `signTypedData`
 */
export function buildGuardianSignaturePayload(
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: `0x${string}`;
  },
  message: GuardianApprovalData
) {
  return {
    domain,
    types: GUARDIAN_APPROVAL_TYPES,
    primaryType: 'GuardianApproval',
    message,
  } as const;
}

/**
 * Helpers to compute the `paramsHash` for various actions based on the contract logic.
 */
export const GuardianParamsHash = {
  initiateRecovery(newOwner: `0x${string}`) {
    // bytes32 paramsHash = keccak256(abi.encodePacked(newOwner));
    return keccak256(encodePacked(['address'], [newOwner]));
  },
  
  executeRecovery(pendingNewOwner: `0x${string}`) {
    // bytes32 paramsHash = keccak256(abi.encodePacked(r.pendingNewOwner));
    return keccak256(encodePacked(['address'], [pendingNewOwner]));
  },

  cancelRecovery(pendingNewOwner: `0x${string}`) {
    // bytes32 paramsHash = keccak256(abi.encodePacked(r.pendingNewOwner));
    return keccak256(encodePacked(['address'], [pendingNewOwner]));
  },
  
  empty() {
    // For hardFreeze, unfreeze which pass bytes32(0)
    return pad('0x0');
  }
};
