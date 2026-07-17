import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { showdowns } from "./showdowns";
import { arenaUser } from "./arena_users";

export const showdownParticipants = pgTable(
  "showdown_participants",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),

    showdownId: text("showdown_id")
      .notNull()
      .references(() => showdowns.id, { onDelete: "cascade" }),

    arenaUserId: text("arena_user_id")
      .notNull()
      .references(() => arenaUser.id, { onDelete: "cascade" }),

    seed: smallint("seed"),
    eliminatedAtRound: smallint("eliminated_at_round"), // null = still alive / champion

    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("showdown_participants_unique").on(
      table.showdownId,
      table.arenaUserId,
    ),
  ],
);