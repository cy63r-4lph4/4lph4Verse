import { createId } from '@paralleldrive/cuid2';
import {
  pgTable,
  text,
  timestamp,
  smallint,
  integer,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { arenaCourses } from './arena_courses';
import { arenaUser } from './arena_users';

export const dungeonRunStatus = pgEnum('dungeon_run_status', [
  'active',
  'complete',
]);

export const dungeonRuns = pgTable('dungeon_runs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),

  courseId: text('course_id')
    .notNull()
    .references(() => arenaCourses.id, { onDelete: 'cascade' }),

  arenaUserId: text('arena_user_id')
    .notNull()
    .references(() => arenaUser.id, { onDelete: 'cascade' }),

  livesRemaining: smallint('lives_remaining').default(3).notNull(),
  score: integer('score').default(0).notNull(),
  questionsAnswered: smallint('questions_answered').default(0).notNull(),
  questionsCorrect: smallint('questions_correct').default(0).notNull(),
  streak: smallint('streak').default(0).notNull(),
  bestStreak: smallint('best_streak').default(0).notNull(),

  category: varchar('category', { length: 64 }),
  status: dungeonRunStatus('status').default('active').notNull(),

  startedAt: timestamp('started_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
});
