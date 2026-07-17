import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { feedPosts } from "./feed_posts";
import { arenaUser } from "./arena_users";

export const feedReactions = pgTable(
  "feed_reactions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),

    postId: text("post_id")
      .notNull()
      .references(() => feedPosts.id, { onDelete: "cascade" }),

    arenaUserId: text("arena_user_id")
      .notNull()
      .references(() => arenaUser.id, { onDelete: "cascade" }),

    // Semantic reaction key: "respect" | "hype" | "rivalry" | "brutal".
    // Not tied to a specific emoji glyph — the UI maps key -> emoji.
    type: varchar("type", { length: 16 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("feed_reactions_unique").on(table.postId, table.arenaUserId, table.type),
  ],
);