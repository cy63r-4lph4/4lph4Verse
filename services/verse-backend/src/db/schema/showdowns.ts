import { createId } from "@paralleldrive/cuid2";
import {
  pgTable,
  text,
  timestamp,
  smallint,
  integer,
  pgEnum,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { arenaCourses } from "./arena_courses";
import { arenaUser } from "./arena_users";
import { showdownParticipants } from "./showdown_participants";

export const showdownMode = pgEnum("showdown_mode", [
  "tournament",
  "duel",
  "async_duel",
]);

export const showdownStatus = pgEnum("showdown_status", [
  "draft", "lobby", "seeding", "challenge_pending", "ready_check", "live", "complete",
]);

export const showdowns = pgTable("showdowns", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  courseId: text("course_id")
    .notNull()
    .references(() => arenaCourses.id, { onDelete: "cascade" }),

  createdBy: text("created_by")
    .notNull()
    .references(() => arenaUser.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  status: showdownStatus("status").default("draft").notNull(),
  mode: showdownMode("mode").default("tournament").notNull(),

  questionsPerMatch: smallint("questions_per_match").default(3).notNull(),
  timeLimitSeconds: smallint("time_limit_seconds").default(20).notNull(),
  matchCountdownMs: integer("match_countdown_ms").default(3000).notNull(),

  totalRounds: smallint("total_rounds"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),

  // Deferred reference — resolved lazily, so the circular import with
  // showdown_participants.ts (which references showdowns.id) is safe.
  championId: text("champion_id").references(
    (): AnyPgColumn => showdownParticipants.id,
    { onDelete: "set null" },
  ),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  // Async duel: point in time after which the challenge auto-expires
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});