import { pgTable, text, integer, timestamp, unique } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { verseProfiles } from '../core/verse_profiles';

/**
 * Verse Managed Wallets
 *
 * Each row represents one Verse Wallet identity. The `walletIdentityId` is the
 * immutable protocol-level identity anchor — it is derived from a secure random
 * seed via keccak256 and MUST NOT change for the lifetime of the wallet.
 *
 * INV-01: walletIdentityId is immutable after creation.
 * INV-04: walletIdentitySeed is NEVER stored here — it lives in MPC/passkey infrastructure.
 * INV-24: walletIdentityId uniquely identifies the Verse Wallet independently of
 *         authentication credentials and controller rotation.
 */
export const wallets = pgTable(
  'wallets',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),

    /** FK to the Verse Profile that owns this wallet. */
    verseProfileId: text('verse_profile_id')
      .notNull()
      .references(() => verseProfiles.id, { onDelete: 'cascade' }),

    /**
     * Protocol-level wallet identity.
     * Derived as: keccak256("verse.wallet.identity.v1" || walletIdentitySeed)
     * Stored as a 0x-prefixed hex string (66 chars).
     * IMMUTABLE — never changes after creation.
     * INV-02: MUST NOT be derived from any controller identifier.
     * INV-03: MUST NOT be derived from the database CUID.
     */
    walletIdentityId: text('wallet_identity_id').notNull(),

    /**
     * Protocol version used during derivation.
     * Increment only when the derivation formula changes.
     */
    derivationVersion: integer('derivation_version').notNull().default(1),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // One Verse Wallet per profile
    uniqueProfileWallet: unique('uq_wallets_profile').on(table.verseProfileId),
    // walletIdentityId must be globally unique
    uniqueIdentityId: unique('uq_wallets_identity_id').on(
      table.walletIdentityId,
    ),
  }),
);
