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
  "tournament",  // bracketed, instructor-controlled via Remote
  "duel",        // 1v1, peer-initiated, self-driving
]);

export const showdownStatus = pgEnum("showdown_status", [
  "draft",
  "lobby",
  "seeding",
  "challenge_pending", // duel-only: challenge sent, awaiting opponent's accept/decline
  "live",
  "complete",
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
});