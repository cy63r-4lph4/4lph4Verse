import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { arenaCourses } from "src/db/schema/arena_courses";
import { arenaUser } from "src/db/schema/arena_users";

export const arenaUserCourses = pgTable("arena_user_courses", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    userId: text("user_id")
        .notNull()
        .references(() => arenaUser.id, { onDelete: "cascade" }),
    courseId: text("course_id")
        .notNull()
        .references(() => arenaCourses.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
})