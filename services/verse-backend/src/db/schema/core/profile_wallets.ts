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

export const profileWallets = pgTable(
  "profile_wallets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),

    profileId: text("profile_id")
      .notNull()
      .references(() => verseProfiles.id, { onDelete: "cascade" }),

    address: varchar("address", { length: 42 }).notNull(),
    walletType: varchar("wallet_type", { length: 32 }).notNull(), // 'smart_account' | 'imported_eoa' | 'hardware'

    isActive: boolean("is_active").default(true).notNull(),

    // In a multi-chain environment, a single Smart Account address might be deployed on multiple chains.
    // Storing it as a JSON array or comma-separated string can help track networks (e.g. "42220,84532").
    // We'll store an array of chain IDs as JSON for ease of querying later if needed.
    // Wait, let's keep it simple with text since it's an array of strings/numbers.
    supportedChains: text("supported_chains"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // A wallet address should be unique across the platform
    uniqueAddress: unique("uq_profile_wallets_address").on(table.address),
  })
);
