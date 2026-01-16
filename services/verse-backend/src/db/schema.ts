import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const arenaUsers = pgTable("arena_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),

  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),

  avatar: text("avatar"),
  school: text("school"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
