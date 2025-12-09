export const RESERVED_HANDLES = new Set([
  // System / protocol
  "admin",
  "root",
  "system",
  "superuser",
  "owner",
  "mod",
  "moderator",
  "null",
  "undefined",
  "void",
  "support",
  "help",
  "helpdesk",
  "team",
  "contact",
  "official",
  "info",
  'alpha',
  '4lph4',
  "cy63r4lph4",
  

  // Project-specific (IMPORTANT – add your names)
  "verse",
  "verseprofile",
  "verse_id",
  "verseid",
  "hirecore",
  "deskmate",
  "vaultoflove",
  "vault_lover",
  "vault_of_love",
  "lease_vault",
  "leasevault",

  // Generic scams/spoof
  "security",
  "service",
  "customer",
  "agent",
  "wallet",
  "recovery",
  "backup",
  "account",

  // Crypto protocol names
  "eth",
  "btc",
  "sol",
  "bnb",
  "crypto",
  "web3",
]);

/**
 * Validate a Verse handle with production-grade rules.
 *
 * @returns { valid: boolean, reason?: string }
 */
export function validateHandle(raw: string) {
  if (!raw) return { valid: false, reason: "EMPTY" };

  // Normalize
  let handle = raw.trim().toLowerCase().normalize("NFKC"); // prevents hidden unicode lookalikes

  // Reject if trimmed result changed significantly (whitespace inside)
  if (/\s/.test(handle)) {
    return { valid: false, reason: "NO_WHITESPACE" };
  }

  // Reject unicode (strict ASCII only)
  if (!/^[\x00-\x7F]*$/.test(handle)) {
    return { valid: false, reason: "ASCII_ONLY" };
  }

  // Reserved names
  if (RESERVED_HANDLES.has(handle)) {
    return { valid: false, reason: "RESERVED" };
  }

  // Must be lowercase alphanumeric + underscore only
  if (!/^[a-z0-9_]+$/.test(handle)) {
    return { valid: false, reason: "INVALID_CHARACTERS" };
  }

  // Length (production safe)
  if (handle.length < 3 || handle.length > 20) {
    return { valid: false, reason: "INVALID_LENGTH" };
  }

  // No leading/trailing underscore
  if (handle.startsWith("_") || handle.endsWith("_")) {
    return { valid: false, reason: "EDGE_UNDERSCORE" };
  }

  // Disallow consecutive underscores "__"
  if (/__/.test(handle)) {
    return { valid: false, reason: "DOUBLE_UNDERSCORE" };
  }

  // Must contain at least one letter to avoid meaningless handles
  if (!/[a-z]/.test(handle)) {
    return { valid: false, reason: "NEEDS_LETTER" };
  }

  return { valid: true };
}
