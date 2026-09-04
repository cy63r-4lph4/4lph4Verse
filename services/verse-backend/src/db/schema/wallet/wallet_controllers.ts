import {
  pgTable,
  text,
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
 * Wallet Controllers — on-chain validators installed on a Verse Smart Account.
 *
 * Each row represents one authentication controller that can authorize
 * UserOperations for the associated wallet.
 *
 * ─── Controller Types ─────────────────────────────────────────────
 *  passkey   → WebAuthn/P-256 credential. Identified by base64url credential ID.
 *              Represented on-chain by WebAuthnValidator (ERC-7579 module).
 *              The INITIAL root validator at deployment (INV-19).
 *
 *  mpc       → Web3Auth TSS key. Key is NEVER reconstructed (threshold signing).
 *              Identified by the TSS public key as a checksummed Ethereum address.
 *              Represented on-chain by ECDSAValidator.
 *              Installed post-deployment via installModule (INV-20).
 *
 *  hardware  → YubiKey / Ledger / hardware device.
 *              May be WebAuthn (WebAuthnValidator) or ECDSA (ECDSAValidator).
 *              Installed post-deployment via installModule.
 *
 *  guardian  → Social recovery contact. NOT a transaction validator.
 *              Registered in the recovery module, not as a validator module.
 *              Also stored in wallet_guardians for recovery-specific metadata.
 *              `validatorContractAddress` is NULL for guardians.
 *
 * ─── Invariants ───────────────────────────────────────────────────
 *  INV-14: Connected EOAs MUST NOT appear here.
 *  INV-16: This table mirrors on-chain state; it does not define it.
 *  INV-17: Entries MUST be reconciled against on-chain state after any change.
 *  INV-18: Guardians are in the recovery module; `validatorContractAddress` = NULL.
 *  INV-06: Controller rotation MUST NOT change walletIdentityId.
 *  INV-07: Controller rotation MUST NOT change the deployed smart account address.
 */
export const walletControllers = pgTable(
  'wallet_controllers',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),

    /** FK to the wallet identity. */
    walletId: text('wallet_id')
      .notNull()
      .references(() => wallets.id, { onDelete: 'cascade' }),

    /**
     * The type of controller.
     * See header comments for per-type semantics.
     */
    controllerType: text('controller_type').notNull(),

    /**
     * The canonical identifier for this controller, interpreted per type:
     *   passkey   → base64url-encoded WebAuthn credential ID
     *   mpc       → checksummed Ethereum address derived from TSS public key
     *   hardware  → EOA address (ECDSA) or WebAuthn credential ID
     *   guardian  → checksummed EOA or contract address
     */
    controllerIdentifier: text('controller_identifier').notNull(),

    /**
     * The address of the ERC-7579 validator module that represents this
     * controller on-chain. NULL for guardians (registered in recovery module).
     */
    validatorContractAddress: text('validator_contract_address'),

    /**
     * ABI-encoded public data passed to the validator module at installModule time.
     *   passkey  → abi.encode(uint256 x, uint256 y) — P-256 public key coordinates
     *   mpc/hw   → abi.encode(address) — ECDSA signer address
     *   guardian → NULL
     * Used to verify on-chain registration and reproduce initialization data.
     */
    onChainPublicData: text('on_chain_public_data'),

    // ──────────────── Capabilities ────────────────
    /** Whether this controller can sign UserOperations / transactions. */
    canSignTransactions: boolean('can_sign_transactions').notNull().default(true),

    /** Whether this controller can install/remove other modules (root validator only). */
    canManageControllers: boolean('can_manage_controllers').notNull().default(false),

    /** Whether this controller can initiate a social recovery request. */
    canInitiateRecovery: boolean('can_initiate_recovery').notNull().default(false),

    // ──────────────── On-Chain Sync State ────────────────
    /** When this controller was first added (off-chain record creation). */
    addedAt: timestamp('added_at', { withTimezone: true }).notNull().defaultNow(),

    /** When this controller was revoked. NULL = still active. */
    revokedAt: timestamp('revoked_at', { withTimezone: true }),

    /**
     * True once the on-chain installModule (or initialize) tx is confirmed.
     * Backend MUST NOT treat this controller as active until true.
     * INV-16: Backend mirrors on-chain state, does not define it.
     */
    confirmedOnChain: boolean('confirmed_on_chain').notNull().default(false),

    /** Block number at on-chain confirmation. */
    confirmedAtBlock: bigint('confirmed_at_block', { mode: 'bigint' }),
  },
  (table) => ({
    // One controller identifier per wallet (prevents duplicates)
    uniqueWalletController: unique('uq_wallet_controllers_wallet_identifier').on(
      table.walletId,
      table.controllerIdentifier,
    ),
    // Enforce the controller type enum
    checkControllerType: check(
      'chk_wallet_controllers_type',
      sql`${table.controllerType} IN ('passkey', 'mpc', 'hardware', 'guardian')`,
    ),
  }),
);
