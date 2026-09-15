import { createId } from '@paralleldrive/cuid2';
import { varchar, integer } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { arenaSchools } from './arena_universities';
import { users } from './core/users';

export const arenaRole = pgEnum('arena_role', [
  'student',
  'instructor',
  'admin',
]);

export const arenaUser = pgTable('arena_users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),

  schoolId: text('school_id')
    .notNull()
    .references(() => arenaSchools.id, { onDelete: 'cascade' }),

  role: arenaRole('role').default('student'),

  /** Cumulative profile XP — earned from dungeon runs and other non-competitive activities.
   *  This is SEPARATE from the leaderboard, which uses showdown_answers.pointsAwarded. */
  xp: integer('xp').default(0).notNull(),
  level: integer('level').default(1).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
