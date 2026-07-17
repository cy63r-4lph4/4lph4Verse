import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, smallint, pgEnum } from "drizzle-orm/pg-core";
import { showdowns } from "./showdowns";
import { showdownParticipants } from "./showdown_participants";

export const matchStatus = pgEnum("match_status", [
  "pending",   // built, not started
  "active",    // a question is currently live
  "complete",  // winner decided
]);

export const showdownMatches = pgTable("showdown_matches", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  showdownId: text("showdown_id")
    .notNull()
    .references(() => showdowns.id, { onDelete: "cascade" }),

  round: smallint("round").notNull(),       // 0-indexed, matches bracket.rounds[]
  matchIndex: smallint("match_index").notNull(),

  playerAId: text("player_a_id")
    .notNull()
    .references(() => showdownParticipants.id, { onDelete: "cascade" }),

  // null = bye — playerA auto-advances
  playerBId: text("player_b_id")
    .references(() => showdownParticipants.id, { onDelete: "cascade" }),

  winnerId: text("winner_id")
    .references(() => showdownParticipants.id, { onDelete: "set null" }),

  status: matchStatus("status").default("pending").notNull(),
  questionsCompleted: smallint("questions_completed").default(0).notNull(),

  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});