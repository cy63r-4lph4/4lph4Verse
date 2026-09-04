import {
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { verseProfiles } from "./verse_profiles";

export const profileContacts = pgTable(
  "profile_contacts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),

    profileId: text("profile_id")
      .notNull()
      .references(() => verseProfiles.id, { onDelete: "cascade" }),

    type: varchar("type", { length: 32 }).notNull(), // 'email' | 'phone' | 'oauth'
    value: varchar("value", { length: 255 }).notNull(),

    isPrimary: boolean("is_primary").default(false).notNull(),
    isRecovery: boolean("is_recovery").default(false).notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),

    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // Enforce global uniqueness across all contacts (so an email can't belong to two profiles)
    uniqueValue: unique("uq_profile_contacts_value").on(table.value),
  })
);
