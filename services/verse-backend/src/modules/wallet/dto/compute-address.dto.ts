export class ComputeAddressDto {
  /** EVM chain ID to compute the address for. */
  chainId: number;

  /**
   * P-256 public key X coordinate of the initial passkey (as decimal string).
   * Use decimal string to avoid precision loss on large BigInts in JSON.
   */
  initialPasskeyX: string;

  /**
   * P-256 public key Y coordinate of the initial passkey (as decimal string).
   */
  initialPasskeyY: string;

  /**
   * The base64url-encoded WebAuthn credential ID of the initial passkey.
   * Stored as derivationInitController (INV-22) for address recomputation.
   */
  passkeyCredentialId: string;
}
