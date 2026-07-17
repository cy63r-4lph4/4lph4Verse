CREATE TYPE "public"."question_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."showdown_status" AS ENUM('draft', 'lobby', 'seeding', 'live', 'complete');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('pending', 'active', 'complete');--> statement-breakpoint
CREATE TABLE "arena_courses" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"code" varchar(20) NOT NULL,
	"title" text NOT NULL,
	"join_code" varchar(12),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "arena_questions" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"prompt" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_index" smallint NOT NULL,
	"difficulty" "question_difficulty" DEFAULT 'medium' NOT NULL,
	"category" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "arena_user_courses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"course_id" text NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "showdowns" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"created_by" text NOT NULL,
	"title" text NOT NULL,
	"status" "showdown_status" DEFAULT 'draft' NOT NULL,
	"questions_per_match" smallint DEFAULT 3 NOT NULL,
	"time_limit_seconds" smallint DEFAULT 20 NOT NULL,
	"match_countdown_ms" integer DEFAULT 3000 NOT NULL,
	"total_rounds" smallint,
	"champion_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "showdown_participants" (
	"id" text PRIMARY KEY NOT NULL,
	"showdown_id" text NOT NULL,
	"arena_user_id" text NOT NULL,
	"seed" smallint,
	"eliminated_at_round" smallint,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "showdown_matches" (
	"id" text PRIMARY KEY NOT NULL,
	"showdown_id" text NOT NULL,
	"round" smallint NOT NULL,
	"match_index" smallint NOT NULL,
	"player_a_id" text NOT NULL,
	"player_b_id" text,
	"winner_id" text,
	"status" "match_status" DEFAULT 'pending' NOT NULL,
	"questions_completed" smallint DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "showdown_match_questions" (
	"id" text PRIMARY KEY NOT NULL,
	"match_id" text NOT NULL,
	"question_id" text NOT NULL,
	"question_number" smallint NOT NULL,
	"time_limit_seconds" smallint NOT NULL,
	"started_at" timestamp with time zone,
	"ends_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "showdown_answers" (
	"id" text PRIMARY KEY NOT NULL,
	"match_question_id" text NOT NULL,
	"participant_id" text NOT NULL,
	"option_index" smallint NOT NULL,
	"is_correct" boolean NOT NULL,
	"points_awarded" integer DEFAULT 0 NOT NULL,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arena_courses" ADD CONSTRAINT "arena_courses_school_id_arena_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."arena_schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arena_questions" ADD CONSTRAINT "arena_questions_course_id_arena_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."arena_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arena_user_courses" ADD CONSTRAINT "arena_user_courses_user_id_arena_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arena_user_courses" ADD CONSTRAINT "arena_user_courses_course_id_arena_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."arena_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdowns" ADD CONSTRAINT "showdowns_course_id_arena_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."arena_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdowns" ADD CONSTRAINT "showdowns_created_by_arena_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdowns" ADD CONSTRAINT "showdowns_champion_id_showdown_participants_id_fk" FOREIGN KEY ("champion_id") REFERENCES "public"."showdown_participants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdown_participants" ADD CONSTRAINT "showdown_participants_showdown_id_showdowns_id_fk" FOREIGN KEY ("showdown_id") REFERENCES "public"."showdowns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdown_participants" ADD CONSTRAINT "showdown_participants_arena_user_id_arena_users_id_fk" FOREIGN KEY ("arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdown_matches" ADD CONSTRAINT "showdown_matches_showdown_id_showdowns_id_fk" FOREIGN KEY ("showdown_id") REFERENCES "public"."showdowns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdown_matches" ADD CONSTRAINT "showdown_matches_player_a_id_showdown_participants_id_fk" FOREIGN KEY ("player_a_id") REFERENCES "public"."showdown_participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdown_matches" ADD CONSTRAINT "showdown_matches_player_b_id_showdown_participants_id_fk" FOREIGN KEY ("player_b_id") REFERENCES "public"."showdown_participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdown_matches" ADD CONSTRAINT "showdown_matches_winner_id_showdown_participants_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."showdown_participants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdown_match_questions" ADD CONSTRAINT "showdown_match_questions_match_id_showdown_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."showdown_matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdown_match_questions" ADD CONSTRAINT "showdown_match_questions_question_id_arena_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."arena_questions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdown_answers" ADD CONSTRAINT "showdown_answers_match_question_id_showdown_match_questions_id_fk" FOREIGN KEY ("match_question_id") REFERENCES "public"."showdown_match_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showdown_answers" ADD CONSTRAINT "showdown_answers_participant_id_showdown_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."showdown_participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "arena_courses_school_code_unique" ON "arena_courses" USING btree ("school_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "showdown_participants_unique" ON "showdown_participants" USING btree ("showdown_id","arena_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "showdown_answers_unique" ON "showdown_answers" USING btree ("match_question_id","participant_id");