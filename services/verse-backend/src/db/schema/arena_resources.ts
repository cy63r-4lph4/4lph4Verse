import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { arenaCourses } from './arena_courses';

export const arenaResources = pgTable('arena_resources', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),

  courseId: text('course_id')
    .notNull()
    .references(() => arenaCourses.id, { onDelete: 'cascade' }),

  title: text('title').notNull(),
  content: text('content').notNull(), // Markdown text
  isPublished: boolean('is_published').default(false).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
