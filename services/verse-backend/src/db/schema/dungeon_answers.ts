import { createId } from '@paralleldrive/cuid2';
import {
  pgTable,
  text,
  timestamp,
  smallint,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { dungeonRuns } from './dungeon_runs';
import { arenaQuestions } from './arena_questions';

export const dungeonAnswers = pgTable(
  'dungeon_answers',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),

    runId: text('run_id')
      .notNull()
      .references(() => dungeonRuns.id, { onDelete: 'cascade' }),

    questionId: text('question_id')
      .notNull()
      .references(() => arenaQuestions.id, { onDelete: 'restrict' }),

    optionIndex: smallint('option_index').notNull(),
    isCorrect: boolean('is_correct').notNull(),

    answeredAt: timestamp('answered_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('dungeon_answers_unique').on(table.runId, table.questionId),
  ],
);
