import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  integer,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { verseProfiles } from './verse_profiles';
import { sql } from 'drizzle-orm';

export const verseGuardians = pgTable(
  'verse_guardians',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    verseId: varchar('verse_id', { length: 255 })
      .notNull()
      .references(() => verseProfiles.id, { onDelete: 'cascade' }),

    // The Ethereum address of the guardian
    guardianAddress: varchar('guardian_address', { length: 42 }).notNull(),

    // e.g. "active", "pending", "removed"
    status: varchar('status', { length: 20 }).notNull().default('pending'),

    // Track guardian epoch (to invalidate old guardians after an owner change or recovery)
    epoch: integer('epoch').notNull().default(0),

    // Required threshold configuration when this guardian was added/active
    threshold: integer('threshold').notNull().default(1),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`current_timestamp`),
  },
  (table) => ({
    // A guardian address can only be associated with a specific verseId once (per epoch)
    unq_guardian_per_verse: uniqueIndex('unq_guardian_per_verse').on(
      table.verseId,
      table.guardianAddress,
      table.epoch,
    ),
  }),
);
