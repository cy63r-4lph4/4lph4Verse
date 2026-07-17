import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, smallint, boolean, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { showdownMatchQuestions } from "./showdown_match_questions";
import { showdownParticipants } from "./showdown_participants";

export const showdownAnswers = pgTable(
  "showdown_answers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),

    matchQuestionId: text("match_question_id")
      .notNull()
      .references(() => showdownMatchQuestions.id, { onDelete: "cascade" }),

    participantId: text("participant_id")
      .notNull()
      .references(() => showdownParticipants.id, { onDelete: "cascade" }),

    optionIndex: smallint("option_index").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    pointsAwarded: integer("points_awarded").default(0).notNull(),

    answeredAt: timestamp("answered_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("showdown_answers_unique").on(
      table.matchQuestionId,
      table.participantId,
    ),
  ],
);