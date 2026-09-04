CREATE TYPE "public"."question_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."arena_role" AS ENUM('student', 'instructor', 'admin');--> statement-breakpoint
CREATE TYPE "public"."feed_post_type" AS ENUM('thought', 'question', 'announcement');--> statement-breakpoint
CREATE TYPE "public"."forge_submission_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."showdown_mode" AS ENUM('tournament', 'duel', 'async_duel');--> statement-breakpoint
CREATE TYPE "public"."showdown_status" AS ENUM('draft', 'lobby', 'seeding', 'challenge_pending', 'ready_check', 'live', 'complete');--> statement-breakpoint
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
CREATE TABLE "arena_schools" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"slug" varchar(64),
	"logo" varchar(512),
	"country" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "arena_schools_name_unique" UNIQUE("name"),
	CONSTRAINT "arena_schools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "arena_user_courses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"course_id" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"previous_rank" integer,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "arena_users" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"school_id" text NOT NULL,
	"role" "arena_role" DEFAULT 'student',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "arena_users_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "feed_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"author_arena_user_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feed_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"author_arena_user_id" text NOT NULL,
	"type" "feed_post_type" NOT NULL,
	"content" text NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feed_reactions" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"arena_user_id" text NOT NULL,
	"type" varchar(16) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forge_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"submitted_by_arena_user_id" text NOT NULL,
	"prompt" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_index" smallint NOT NULL,
	"difficulty" "question_difficulty" DEFAULT 'medium' NOT NULL,
	"category" varchar(64),
	"status" "forge_submission_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by_arena_user_id" text,
	"review_note" text,
	"approved_question_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" varchar(32) NOT NULL,
	"email" varchar(255),
	"email_verified" boolean DEFAULT false NOT NULL,
	"email_verify_token" text,
	"avatar" varchar(512),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"password_hash" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_credentials_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "verse_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"verse_id" integer,
	"handle" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"bio" text,
	"metadata_uri" text,
	"reputation_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "verse_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "verse_profiles_verse_id_unique" UNIQUE("verse_id"),
	CONSTRAINT "verse_profiles_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "profile_contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"type" varchar(32) NOT NULL,
	"value" varchar(255) NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"is_recovery" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_profile_contacts_value" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "showdowns" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"created_by" text NOT NULL,
	"title" text NOT NULL,
	"status" "showdown_status" DEFAULT 'draft' NOT NULL,
	"mode" "showdown_mode" DEFAULT 'tournament' NOT NULL,
	"questions_per_match" smallint DEFAULT 3 NOT NULL,
	"time_limit_seconds" smallint DEFAULT 20 NOT NULL,
	"match_countdown_ms" integer DEFAULT 3000 NOT NULL,
	"total_rounds" smallint,
	"scheduled_at" timestamp with time zone,
	"champion_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "showdown_participants" (
	"id" text PRIMARY KEY NOT NULL,
	"showdown_id" text NOT NULL,
	"arena_user_id" text NOT NULL,
	"seed" smallint,
	"eliminated_at_round" smallint,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"async_score" integer
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
ALTER TABLE "arena_users" ADD CONSTRAINT "arena_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arena_users" ADD CONSTRAINT "arena_users_school_id_arena_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."arena_schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_post_id_feed_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."feed_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_author_arena_user_id_arena_users_id_fk" FOREIGN KEY ("author_arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_posts" ADD CONSTRAINT "feed_posts_course_id_arena_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."arena_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_posts" ADD CONSTRAINT "feed_posts_author_arena_user_id_arena_users_id_fk" FOREIGN KEY ("author_arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_reactions" ADD CONSTRAINT "feed_reactions_post_id_feed_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."feed_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_reactions" ADD CONSTRAINT "feed_reactions_arena_user_id_arena_users_id_fk" FOREIGN KEY ("arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forge_submissions" ADD CONSTRAINT "forge_submissions_course_id_arena_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."arena_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forge_submissions" ADD CONSTRAINT "forge_submissions_submitted_by_arena_user_id_arena_users_id_fk" FOREIGN KEY ("submitted_by_arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forge_submissions" ADD CONSTRAINT "forge_submissions_reviewed_by_arena_user_id_arena_users_id_fk" FOREIGN KEY ("reviewed_by_arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forge_submissions" ADD CONSTRAINT "forge_submissions_approved_question_id_arena_questions_id_fk" FOREIGN KEY ("approved_question_id") REFERENCES "public"."arena_questions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verse_profiles" ADD CONSTRAINT "verse_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_contacts" ADD CONSTRAINT "profile_contacts_profile_id_verse_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."verse_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
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
CREATE UNIQUE INDEX "feed_reactions_unique" ON "feed_reactions" USING btree ("post_id","arena_user_id","type");--> statement-breakpoint
CREATE UNIQUE INDEX "showdown_participants_unique" ON "showdown_participants" USING btree ("showdown_id","arena_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "showdown_answers_unique" ON "showdown_answers" USING btree ("match_question_id","participant_id");