import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { feedPosts } from "./feed_posts";
import { arenaUser } from "./arena_users";

export const feedComments = pgTable("feed_comments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  postId: text("post_id")
    .notNull()
    .references(() => feedPosts.id, { onDelete: "cascade" }),

  authorArenaUserId: text("author_arena_user_id")
    .notNull()
    .references(() => arenaUser.id, { onDelete: "cascade" }),

  content: text("content").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});