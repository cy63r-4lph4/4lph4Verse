import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  integer,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { verseProfiles } from './verse_profiles';
import { sql } from 'drizzle-orm';

export const verseRecoveryRequests = pgTable(
  'verse_recovery_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    verseId: varchar('verse_id', { length: 255 })
      .notNull()
      .references(() => verseProfiles.id, { onDelete: 'cascade' }),

    // Explicitly distinguish between guardian-initiated and self-recovery
    recoveryType: varchar('recovery_type', { length: 32 }).notNull(), // 'guardian' | 'self'

    // The proposed new owner address
    pendingNewOwner: varchar('pending_new_owner', { length: 42 }).notNull(),

    // Is this recovery actively pending execution?
    active: boolean('active').notNull().default(true),

    // --- Guardian Recovery specific fields ---
    // The delay until recovery can be executed
    eta: timestamp('eta'),
    // Recovery nonce
    nonce: integer('nonce').default(0),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`current_timestamp`),
  },
  (table) => ({
    idx_verse_recovery: index('idx_verse_recovery').on(
      table.verseId,
      table.active,
    ),
  }),
);
