import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

/**
 * Supported Chains — operational registry of EVM chains where Verse Wallets can exist.
 *
 * This table stores the per-chain configuration required for:
 *   1. Computing counterfactual addresses (factory, impl, validator addresses)
 *   2. Submitting UserOperations (bundlerUrl, entryPoint)
 *   3. Verifying pre-implementation checklist items
 *
 * ─── Address Parity Requirements ─────────────────────────────────
 * For two chains to have parity (same wallet address), ALL of the
 * following must be identical (INV-12):
 *   - kernelFactoryAddress
 *   - kernelImplAddress
 *   - passkeyValidatorAddress
 *   - entryPointAddress
 *   - The ERC1967 proxy bytecode (same Kernel SDK version)
 */
export const supportedChains = pgTable('supported_chains', {
  /** The EVM chain ID. This is the primary key. */
  chainId: integer('chain_id').primaryKey(),

  /** Human-readable name (e.g., "Base Sepolia", "Celo Mainnet"). */
  name: text('name').notNull(),

  /** Primary JSON-RPC endpoint for this chain. */
  rpcUrl: text('rpc_url').notNull(),

  /** Block explorer base URL (e.g., https://basescan.org). */
  explorerUrl: text('explorer_url'),

  // ──────────────── Pre-Implementation Verification Flags ────────────────
  /** True if Nick's Factory (0x4e59b44847b379578588920ca78fbf26c0b4956c) is
   *  confirmed present via `cast code` or `eth_getCode`. */
  nickFactoryVerified: boolean('nick_factory_verified').notNull().default(false),

  /** True if RIP-7212 P-256 precompile at 0x100 is confirmed via eth_call. */
  rip7212Verified: boolean('rip7212_verified').notNull().default(false),

  // ──────────────── Contract Addresses ────────────────
  /** Address of the KernelFactory on this chain (via Nick's Factory). */
  kernelFactoryAddress: text('kernel_factory_address'),

  /** Address of the Kernel v3.1 implementation on this chain. */
  kernelImplAddress: text('kernel_impl_address'),

  /** Address of the WebAuthn/passkey validator module on this chain. */
  passkeyValidatorAddress: text('passkey_validator_address'),

  /** Address of the ERC-4337 EntryPoint v0.7 on this chain.
   *  Should be 0x0000000071727De22E5E9d8BAf0edAc6f37da032 on all chains. */
  entryPointAddress: text('entry_point_address'),

  /** URL of the Bundler API endpoint for this chain (ERC-4337 UserOp submission). */
  bundlerUrl: text('bundler_url'),

  /** URL of the Paymaster API endpoint for this chain (gasless sponsorship). */
  paymasterUrl: text('paymaster_url'),

  /** Whether this chain is active for wallet provisioning. */
  isActive: boolean('is_active').notNull().default(false),

  /** Whether this chain is a testnet (affects UI treatment and paymaster limits). */
  isTestnet: boolean('is_testnet').notNull().default(false),

  addedAt: timestamp('added_at', { withTimezone: true }).notNull().defaultNow(),

  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
