/**
 * Verse Wallet Protocol Constants
 *
 * These values are FROZEN — changing them changes all wallet addresses.
 * Any modification must go through a protocol version bump (derivationVersion).
 */

/** Domain separator prefix — identifies the Verse protocol namespace. */
export const VERSE_DOMAIN_SEPARATOR = 'verse.v1' as const;

/**
 * Wallet identity domain — the prefix hashed into every walletIdentityId.
 * Format: keccak256(WALLET_IDENTITY_DOMAIN || walletIdentitySeed)
 */
export const WALLET_IDENTITY_DOMAIN = 'verse.wallet.identity.v1' as const;

/** Current derivation protocol version. */
export const DERIVATION_VERSION = 1n;

/**
 * ERC-4337 EntryPoint v0.7 address — canonical, immutable across all EVM chains.
 * Source: https://eips.ethereum.org/EIPS/eip-4337
 */
export const ENTRYPOINT_V07_ADDRESS =
  '0x0000000071727De22E5E9d8BAf0edAc6f37da032' as const;

/**
 * Nick's Factory (ERC-2470 Singleton Factory) — deterministic deployer.
 * Used to deploy KernelFactory at identical addresses across EVM chains.
 * Source: https://eips.ethereum.org/EIPS/eip-2470
 */
export const NICKS_FACTORY_ADDRESS =
  '0x4e59b44847b379578588920cA78FbF26c0B4956C' as const;

/**
 * Chain IDs for supported Verse Wallet networks.
 * These must have Nick's Factory AND RIP-7212 verified before activation.
 */
export const VERSE_CHAIN_IDS = {
  /** Celo Mainnet — verified: Nick's Factory ✅, RIP-7212 ✅ */
  CELO_MAINNET: 42220,
  /** Base Sepolia (testnet) — RIP-7212 ✅, Nick's Factory ⚠️ needs cast code */
  BASE_SEPOLIA: 84532,
  /** Lisk Sepolia (testnet) — verified: Nick's Factory ✅, RIP-7212 ✅ */
  LISK_SEPOLIA: 4202,
  /** Celo Sepolia (testnet) — Nick's Factory ⚠️ needs cast code */
  CELO_SEPOLIA: 11142220,
} as const;

/**
 * Kernel ERC-7579 module type constant for validators.
 * Used when calling installModule to add controllers post-deployment.
 */
export const KERNEL_MODULE_TYPE_VALIDATOR = 1n;

/**
 * Kernel ERC-7579 module type constant for executors.
 * Used for installing the recovery module.
 */
export const KERNEL_MODULE_TYPE_EXECUTOR = 2n;
