import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, smallint, jsonb, varchar, pgEnum } from "drizzle-orm/pg-core";
import { arenaCourses } from "./arena_courses";
import { arenaUser } from "./arena_users";
import { arenaQuestions } from "./arena_questions";
import { questionDifficulty } from "./arena_questions";

export const forgeSubmissionStatus = pgEnum("forge_submission_status", [
  "pending",
  "approved",
  "rejected",
]);

export const forgeSubmissions = pgTable("forge_submissions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  courseId: text("course_id")
    .notNull()
    .references(() => arenaCourses.id, { onDelete: "cascade" }),

  submittedByArenaUserId: text("submitted_by_arena_user_id")
    .notNull()
    .references(() => arenaUser.id, { onDelete: "cascade" }),

  prompt: text("prompt").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctIndex: smallint("correct_index").notNull(),
  difficulty: questionDifficulty("difficulty").default("medium").notNull(),
  category: varchar("category", { length: 64 }),

  status: forgeSubmissionStatus("status").default("pending").notNull(),

  reviewedByArenaUserId: text("reviewed_by_arena_user_id")
    .references(() => arenaUser.id, { onDelete: "set null" }),
  reviewNote: text("review_note"),

  // Set only on approval — the resulting live question in the bank.
  approvedQuestionId: text("approved_question_id")
    .references(() => arenaQuestions.id, { onDelete: "set null" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});