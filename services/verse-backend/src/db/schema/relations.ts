import { relations } from 'drizzle-orm';
import { users } from './core/users';
import { arenaUser } from './arena_users';
import { arenaSchools } from './arena_universities';

export const usersRelations = relations(users, ({ one }) => ({
    arenaUser: one(arenaUser, {
        fields: [users.id],
        references: [arenaUser.userId],
    }),
}));

export const arenaUserRelations = relations(arenaUser, ({ one }) => ({
    user: one(users, {
        fields: [arenaUser.userId],
        references: [users.id],
    }),
    school: one(arenaSchools, {
        fields: [arenaUser.schoolId],
        references: [arenaSchools.id],
    }),
}));

export const arenaSchoolRelations = relations(arenaSchools, ({ many }) => ({
    students: many(arenaUser),
}));
