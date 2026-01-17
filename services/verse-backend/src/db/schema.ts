import {
  pgTable,
  text,
  timestamp,
  varchar,
  foreignKey,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const arenaSchools = pgTable("arena_schools", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  name: varchar("name", { length: 128 })
    .notNull()
    .unique(),

  shortName: varchar("short_name", { length: 32 })
    .unique(),

  logo: varchar("logo", { length: 512 }),

  country: varchar("country", { length: 64 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const arenaUsers = pgTable("arena_users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  username: varchar("username", { length: 32 })
    .notNull()
    .unique(),

  email: varchar("email", { length: 255 })
    .unique(), // Optional for V1 pilot

  avatar: varchar("avatar", { length: 512 }),

  // Establishing the relationship
  schoolId: text("school_id")
    .notNull()
    .references(() => arenaSchools.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});