import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, varchar, smallint, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { arenaCourses } from "./arena_courses";

export const questionDifficulty = pgEnum("question_difficulty", [
  "easy",
  "medium",
  "hard",
]);

export const arenaQuestions = pgTable("arena_questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  courseId: text("course_id")
    .notNull()
    .references(() => arenaCourses.id, { onDelete: "cascade" }),

  prompt: text("prompt").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctIndex: smallint("correct_index").notNull(),

  difficulty: questionDifficulty("difficulty").default("medium").notNull(),
  category: varchar("category", { length: 64 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});