/**
 * Verse Wallet — Passkey Utilities
 *
 * Provides secure WebAuthn Passkey registration and authentication helpers.
 * All cryptographic material (private keys) stays inside the browser's
 * Secure Enclave / TPM — it NEVER leaves the device.
 *
 * Why Passkeys are the most secure option:
 *   • Private key lives in hardware (TPM/Secure Enclave) — cannot be extracted
 *   • Phishing-resistant: bound to the relying party domain (rpId)
 *   • Biometric/PIN gated: requires user presence for every signature
 *   • No seed phrase: no single point of failure to backup/leak
 */
/** Encode ArrayBuffer → base64url string */
export declare function bufferToBase64url(buf: ArrayBuffer): string;
/** Decode base64url string → Uint8Array */
export declare function base64urlToBuffer(b64url: string): Uint8Array;
/** Encode string → Uint8Array via TextEncoder */
export declare function strToBuffer(str: string): Uint8Array;
export interface PasskeyRegistrationResult {
    /** base64url-encoded credential ID — used as the persistent controller identifier */
    credentialId: string;
    /** P-256 public key X coordinate as BigInt */
    publicKeyX: bigint;
    /** P-256 public key Y coordinate as BigInt */
    publicKeyY: bigint;
    /** The raw PublicKeyCredential returned by the browser */
    credential: PublicKeyCredential;
}
export interface PasskeyAuthResult {
    /** base64url-encoded credential ID */
    credentialId: string;
    /** The raw response bytes (clientDataJSON) */
    clientDataJSON: ArrayBuffer;
    /** The authenticatorData bytes */
    authenticatorData: ArrayBuffer;
    /** The DER-encoded signature bytes */
    signature: ArrayBuffer;
}
/**
 * Extracts P-256 public key coordinates from a WebAuthn attestation.
 *
 * Strategy: import the raw COSE key into SubtleCrypto, then export as "raw"
 * format (65-byte uncompressed point: 0x04 || X[32] || Y[32]).
 * This is the most reliable approach — it delegates CBOR/COSE parsing to
 * the browser's native implementation.
 *
 * Falls back to manual CBOR scan if SubtleCrypto import fails.
 */
export declare function extractP256PublicKey(cosePublicKey: ArrayBuffer): Promise<{
    x: bigint;
    y: bigint;
}>;
/**
 * Registers a new WebAuthn Passkey for a Verse Wallet.
 *
 * Security properties:
 *  ✓ Private key generated in Secure Enclave — never extractable
 *  ✓ Algorithm: ES256 (P-256 / secp256r1) — compatible with VerseWallet validator
 *  ✓ Attestation: none (privacy-preserving, no device fingerprint sent)
 *  ✓ User verification: required (biometric or PIN always needed)
 *  ✓ Resident key (discoverable): required (enables passwordless login)
 *
 * @param userHandle  - A stable, opaque user ID (e.g. verseProfileId). Never shown to user.
 * @param displayName - The human-readable name shown on the passkey prompt.
 * @param rpId        - Relying Party ID (must match window.location.hostname).
 */
export declare function registerPasskey(userHandle: string, displayName: string, rpId: string): Promise<PasskeyRegistrationResult>;
/**
 * Authenticates with an existing Passkey (discoverable credential flow).
 *
 * The challenge should be provided by the backend to prevent replay attacks.
 * For wallet connect, we use a timestamp-based local challenge (acceptable for
 * address discovery; NOT acceptable for authoritative transaction signing).
 *
 * For transaction signing, ALWAYS use a backend-issued challenge (see signUserOperation).
 *
 * @param challenge  - Challenge bytes (from backend for signing; local for connect)
 * @param rpId       - Relying Party ID (window.location.hostname)
 * @param credentialId - Optional: restrict to a specific credential
 */
export declare function authenticatePasskey(challenge: BufferSource, rpId: string, credentialId?: string): Promise<PasskeyAuthResult>;
//# sourceMappingURL=passkey.d.ts.map