import {
  pgTable,
  text,
  integer,
  boolean,
  bigint,
  timestamp,
  unique,
  check,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { wallets } from './wallets';

/**
 * Smart Account Instances — one per chain per wallet.
 *
 * Each row represents the deployment (or predicted address) of a Verse Smart Account
 * on a specific EVM chain. The `address` field holds the counterfactual CREATE2 address
 * before deployment and the confirmed deployed address after.
 *
 * INV-23: Address stability means stable AFTER deployment.
 *         Before first deployment, changing the initial controller changes the address.
 * INV-25: The counterfactual address depends on walletIdentityId AND the initial
 *         controller's public key. This is required for front-running protection.
 * INV-07: After deployment, controller rotation MUST NOT change this address.
 * INV-13: isAddressParity MUST be set accurately before marking a chain active.
 */
export const walletAccounts = pgTable(
  'wallet_accounts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),

    /** FK to the wallet identity. */
    walletId: text('wallet_id')
      .notNull()
      .references(() => wallets.id, { onDelete: 'cascade' }),

    /** The EVM chain ID for this account instance. */
    chainId: integer('chain_id').notNull(),

    /**
     * The smart account address on this chain.
     * Starts as the counterfactual CREATE2 address (before deployment),
     * confirmed as the deployed address after first UserOperation.
     * Must be a checksummed 0x-prefixed 42-character Ethereum address.
     */
    address: text('address').notNull(),

    /**
     * Tracks the deployment lifecycle.
     *   'predicted'  — address computed, account not yet deployed on-chain
     *   'deploying'  — initCode submitted in a UserOperation, awaiting confirmation
     *   'deployed'   — verified deployed and initialized on-chain
     */
    deploymentStatus: text('deployment_status').notNull().default('predicted'),

    /** Timestamp when the account was confirmed deployed on-chain. */
    deployedAt: timestamp('deployed_at', { withTimezone: true }),

    /** Block number at deployment confirmation. */
    deployedAtBlock: bigint('deployed_at_block', { mode: 'bigint' }),

    /**
     * True if this address is identical to the address on the primary chain,
     * meaning full CREATE2 parity (same factory + impl + validator + salt).
     * INV-12: Must be verified, not assumed.
     */
    isAddressParity: boolean('is_address_parity').notNull().default(true),

    /** Human-readable reason when isAddressParity is false. */
    parityVariantReason: text('parity_variant_reason'),

    /**
     * The controllerIdentifier of the initial controller used in initCalldata.
     * Recorded at deployment time — MUST NOT change afterwards (INV-22).
     * Used to reproduce the full derivation formula.
     */
    derivationInitController: text('derivation_init_controller'),

    // ──────────────────────────────────────────────
    // Factory configuration audit trail
    // All fields below must be recorded to allow off-chain address recomputation.
    // INV-21: actualSalt = keccak256(initCalldata || verseInputSalt)
    // ──────────────────────────────────────────────

    /** Address of the KernelFactory (Nick's Factory proxy) used for deployment. */
    kernelFactoryAddress: text('kernel_factory_address').notNull(),

    /** Address of the Kernel v3.1 implementation contract on this chain. */
    kernelImplAddress: text('kernel_impl_address').notNull(),

    /** Address of the WebAuthn/passkey validator module on this chain. */
    passkeyValidatorAddress: text('passkey_validator_address').notNull(),

    /** Address of the ERC-4337 EntryPoint contract on this chain. */
    entryPointAddress: text('entry_point_address').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // One account per wallet per chain
    uniqueWalletChain: unique('uq_wallet_accounts_wallet_chain').on(
      table.walletId,
      table.chainId,
    ),
    // Validate deployment status enum
    checkDeploymentStatus: check(
      'chk_wallet_accounts_deployment_status',
      sql`${table.deploymentStatus} IN ('predicted', 'deploying', 'deployed')`,
    ),
  }),
);
