import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { arenaCourses } from "./arena_courses";
import { arenaUser } from "./arena_users";

export const feedPostType = pgEnum("feed_post_type", [
  "thought",
  "question",
  "announcement",
]);

export const feedPosts = pgTable("feed_posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  courseId: text("course_id")
    .notNull()
    .references(() => arenaCourses.id, { onDelete: "cascade" }),

  authorArenaUserId: text("author_arena_user_id")
    .notNull()
    .references(() => arenaUser.id, { onDelete: "cascade" }),

  type: feedPostType("type").notNull(),
  content: text("content").notNull(),

  // Only meaningful for type === 'announcement'; enforced in the service,
  // not the schema, since pgEnum + conditional constraints get awkward.
  pinned: boolean("pinned").default(false).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});