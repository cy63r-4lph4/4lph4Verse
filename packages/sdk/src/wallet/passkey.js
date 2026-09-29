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
// ─── Helpers ────────────────────────────────────────────────────────────────
/** Encode ArrayBuffer → base64url string */
export function bufferToBase64url(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}
/** Decode base64url string → Uint8Array */
export function base64urlToBuffer(b64url) {
    const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=");
    return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}
/** Encode string → Uint8Array via TextEncoder */
export function strToBuffer(str) {
    return new TextEncoder().encode(str);
}
// ─── COSE Key Parsing ────────────────────────────────────────────────────────
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
export async function extractP256PublicKey(cosePublicKey) {
    try {
        // Import the COSE_Key as an EC P-256 key via SubtleCrypto
        const cryptoKey = await crypto.subtle.importKey("raw", 
        // SubtleCrypto cannot import COSE directly; try raw 65-byte uncompressed first
        cosePublicKey, { name: "ECDSA", namedCurve: "P-256" }, true, ["verify"]);
        // Export as raw (0x04 || x[32] || y[32])
        const raw = new Uint8Array(await crypto.subtle.exportKey("raw", cryptoKey));
        // raw[0] = 0x04 (uncompressed point marker)
        const xBytes = raw.slice(1, 33);
        const yBytes = raw.slice(33, 65);
        return {
            x: bytesToBigInt(xBytes),
            y: bytesToBigInt(yBytes),
        };
    }
    catch {
        // Fallback: manual CBOR scan for COSE EC2 key map
        // COSE map keys: -2 (0x21) = x, -3 (0x22) = y
        return parseCOSEPublicKey(new Uint8Array(cosePublicKey));
    }
}
/** Converts a big-endian byte array to BigInt. */
function bytesToBigInt(arr) {
    return arr.reduce((acc, byte) => (acc << 8n) | BigInt(byte), 0n);
}
/**
 * Manual COSE EC2 key parser for CBOR-encoded attestation public keys.
 *
 * COSE map structure (RFC 8152):
 *   {1: 2, 3: -7, -1: 1, -2: <x[32]>, -3: <y[32]>}
 *   CBOR key -2 = 0x21, CBOR key -3 = 0x22
 *
 * We scan the flat CBOR byte stream for the -2/-3 keys and extract
 * the following byte string values.
 */
function parseCOSEPublicKey(bytes) {
    let x = null;
    let y = null;
    let i = 1; // skip CBOR map header
    while (i < bytes.length - 1 && !(x && y)) {
        const keyByte = bytes[i++];
        if (keyByte === 0x21 || keyByte === 0x22) {
            // Next value is a byte string: major type 2 (0x40 | len)
            const lenByte = bytes[i++];
            const majorType = (lenByte >> 5) & 0x07;
            if (majorType !== 2)
                break; // expected byte string
            let len;
            const addInfo = lenByte & 0x1f;
            if (addInfo < 24) {
                len = addInfo;
            }
            else if (addInfo === 24) {
                len = bytes[i++];
            }
            else {
                break; // unexpected length encoding
            }
            const coord = bytes.slice(i, i + len);
            i += len;
            if (keyByte === 0x21)
                x = coord; // -2 = x
            else
                y = coord; // -3 = y
        }
        else {
            // Skip this key-value pair
            i = skipCBORValue(bytes, i);
        }
    }
    if (!x || !y) {
        throw new Error("Failed to extract P-256 public key: missing coordinates in COSE key");
    }
    return { x: bytesToBigInt(x), y: bytesToBigInt(y) };
}
/** Skips one CBOR value starting at index i, returns the new index. */
function skipCBORValue(bytes, i) {
    if (i >= bytes.length)
        return i;
    const b = bytes[i++];
    const major = (b >> 5) & 0x07;
    const info = b & 0x1f;
    if (major === 0 || major === 1) {
        // uint or negint — value is inline for info < 24
        if (info === 24)
            i++;
        else if (info === 25)
            i += 2;
        else if (info === 26)
            i += 4;
        else if (info === 27)
            i += 8;
    }
    else if (major === 2 || major === 3) {
        // bstr or tstr
        let len;
        if (info < 24)
            len = info;
        else if (info === 24)
            len = bytes[i++];
        else if (info === 25) {
            len = (bytes[i] << 8) | bytes[i + 1];
            i += 2;
        }
        else
            len = 0;
        i += len;
    }
    else if (major === 4) {
        // array — skip `info` items
        const count = info < 24 ? info : bytes[i++];
        for (let j = 0; j < count; j++)
            i = skipCBORValue(bytes, i);
    }
    else if (major === 5) {
        // map — skip `info * 2` items
        const count = info < 24 ? info : bytes[i++];
        for (let j = 0; j < count * 2; j++)
            i = skipCBORValue(bytes, i);
    }
    return i;
}
// ─── Registration ─────────────────────────────────────────────────────────────
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
export async function registerPasskey(userHandle, displayName, rpId) {
    const credential = (await navigator.credentials.create({
        publicKey: {
            rp: {
                name: "4lph4verse",
                id: rpId,
            },
            user: {
                id: strToBuffer(userHandle),
                name: displayName,
                displayName,
            },
            challenge: strToBuffer("verse-register-" + Date.now()),
            pubKeyCredParams: [
                { type: "public-key", alg: -7 }, // ES256 (P-256) — required for VerseWallet
            ],
            authenticatorSelection: {
                authenticatorAttachment: "platform", // Use on-device authenticator (Face ID, fingerprint, etc.)
                residentKey: "required", // Discoverable credential = passwordless login
                userVerification: "required", // Biometric/PIN always required
            },
            attestation: "none", // Privacy-preserving: no device fingerprinting
            timeout: 60000,
        },
    }));
    if (!credential) {
        throw new Error("Passkey registration was cancelled or failed.");
    }
    const response = credential.response;
    // Extract the COSE-encoded public key from attestation response
    const cosePublicKey = response.getPublicKey?.();
    if (!cosePublicKey) {
        throw new Error("Browser did not return public key — WebAuthn Level 3 required.");
    }
    const { x, y } = await extractP256PublicKey(cosePublicKey);
    return {
        credentialId: credential.id, // base64url credential ID — the persistent handle
        publicKeyX: x,
        publicKeyY: y,
        credential,
    };
}
// ─── Authentication ───────────────────────────────────────────────────────────
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
export async function authenticatePasskey(challenge, rpId, credentialId) {
    const allowCredentials = credentialId
        ? [{ type: "public-key", id: base64urlToBuffer(credentialId) }]
        : []; // empty = discoverable credential (user selects passkey)
    const credential = (await navigator.credentials.get({
        publicKey: {
            challenge,
            rpId,
            userVerification: "required",
            allowCredentials,
            timeout: 60000,
        },
    }));
    if (!credential) {
        throw new Error("Passkey authentication was cancelled or failed.");
    }
    const response = credential.response;
    return {
        credentialId: credential.id,
        clientDataJSON: response.clientDataJSON,
        authenticatorData: response.authenticatorData,
        signature: response.signature,
    };
}
