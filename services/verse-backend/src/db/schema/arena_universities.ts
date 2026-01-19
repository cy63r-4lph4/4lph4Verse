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

  slug: varchar("slug", { length: 64 })
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
