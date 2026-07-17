import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, smallint } from "drizzle-orm/pg-core";
import { showdownMatches } from "./showdown_matches";
import { arenaQuestions } from "./arena_questions";

export const showdownMatchQuestions = pgTable("showdown_match_questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  matchId: text("match_id")
    .notNull()
    .references(() => showdownMatches.id, { onDelete: "cascade" }),

  questionId: text("question_id")
    .notNull()
    .references(() => arenaQuestions.id, { onDelete: "restrict" }),

  questionNumber: smallint("question_number").notNull(), // 1-indexed within the match
  timeLimitSeconds: smallint("time_limit_seconds").notNull(),

  // Mirrors your matchStartedAt pattern: set to "now + countdown" when the
  // question is activated, so any client (including one reconnecting) can
  // derive both the pre-match countdown and the answer window from this
  // single timestamp.
  startedAt: timestamp("started_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
});