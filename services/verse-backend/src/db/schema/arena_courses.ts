import { createId } from "@paralleldrive/cuid2";
import {
    pgTable,
    text,
    timestamp,
    varchar,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { arenaSchools } from "./arena_universities";

export const arenaCourses = pgTable("arena_courses", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),

    schoolId: text("school_id")
        .notNull()
        .references(() => arenaSchools.id, { onDelete: "cascade" }),

    code: varchar("code", { length: 20 }).notNull(),
    title: text("title").notNull(),

    accessKey: varchar("join_code", { length: 12 }),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
},
    (table) => ([
        uniqueIndex(
            "arena_courses_school_code_unique"
        ).on(table.schoolId, table.code),
    ])
);
