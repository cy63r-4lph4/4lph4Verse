import {
  pgTable,
  text,
  timestamp,
  varchar,
  foreignKey,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  username: varchar("username", { length: 32 })
    .notNull()
    .unique(),

  email: varchar("email", { length: 255 })
    .unique(), // Optional for V1 pilot

  avatar: varchar("avatar", { length: 512 }),


  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
