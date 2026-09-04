import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";

export const verseProfiles = pgTable("verse_profiles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  // The on-chain Verse ID token number (can be null before minting)
  verseId: integer("verse_id").unique(),

  // The globally unique Handle matching on-chain, e.g. "alpha"
  handle: varchar("handle", { length: 255 }).notNull().unique(),

  // Display name, bio, etc.
  displayName: varchar("display_name", { length: 255 }),
  bio: text("bio"),
  metadataUri: text("metadata_uri"),

  reputationScore: integer("reputation_score").default(0).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
