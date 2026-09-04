import {
  pgTable,
  text,
  boolean,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { verseProfiles } from '../core/verse_profiles';

/**
 * Connected Wallets — external EOAs linked to a Verse Profile.
 *
 * These are user-imported wallets (MetaMask, Ledger, Rabby, etc.) that
 * the user has explicitly linked to their profile for identity/social purposes.
 *
 * CRITICAL DISTINCTION from wallet_controllers:
 *   - connected_wallets = user-owned external wallets linked for identity
 *   - wallet_controllers = authentication controllers on the Verse Smart Account
 *
 * INV-14: Connected EOAs MUST NOT appear in wallet_controllers.
 * INV-15: A connected EOA MUST NOT be used as a controller for a managed Verse Wallet.
 * INV-08: Authentication (via connected wallet) MUST NOT authorize fund movement.
 */
export const connectedWallets = pgTable(
  'connected_wallets',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),

    /** FK to the Verse Profile. */
    verseProfileId: text('verse_profile_id')
      .notNull()
      .references(() => verseProfiles.id, { onDelete: 'cascade' }),

    /**
     * The external EOA address.
     * Must be checksummed 0x-prefixed 42-character Ethereum address.
     */
    address: text('address').notNull(),

    /**
     * The wallet application type (informational only).
     * e.g., 'metamask' | 'rainbow' | 'ledger' | 'rabby' | 'external'
     */
    walletType: text('wallet_type').notNull().default('external'),

    /** Whether this connected wallet is currently active/visible on the profile. */
    isActive: boolean('is_active').notNull().default(true),

    /** When this external wallet was linked to the profile. */
    connectedAt: timestamp('connected_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // One link per profile per address
    uniqueProfileAddress: unique('uq_connected_wallets_profile_address').on(
      table.verseProfileId,
      table.address,
    ),
  }),
);
