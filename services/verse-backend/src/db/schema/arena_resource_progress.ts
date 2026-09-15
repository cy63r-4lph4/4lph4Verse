import { createId } from '@paralleldrive/cuid2';
import {
  pgTable,
  text,
  timestamp,
  smallint,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { arenaUser } from './arena_users';
import { arenaResources } from './arena_resources';

export const arenaResourceProgress = pgTable(
  'arena_resource_progress',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),

    arenaUserId: text('arena_user_id')
      .notNull()
      .references(() => arenaUser.id, { onDelete: 'cascade' }),

    resourceId: text('resource_id')
      .notNull()
      .references(() => arenaResources.id, { onDelete: 'cascade' }),

    progress: smallint('progress').default(0).notNull(), // 0 to 100
    isCompleted: boolean('is_completed').default(false).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userResourceIdx: uniqueIndex('arena_resource_progress_user_resource_idx').on(
      table.arenaUserId,
      table.resourceId,
    ),
  })
);
