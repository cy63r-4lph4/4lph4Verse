CREATE TYPE "public"."forge_submission_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
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
ALTER TABLE "forge_submissions" ADD CONSTRAINT "forge_submissions_course_id_arena_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."arena_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forge_submissions" ADD CONSTRAINT "forge_submissions_submitted_by_arena_user_id_arena_users_id_fk" FOREIGN KEY ("submitted_by_arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forge_submissions" ADD CONSTRAINT "forge_submissions_reviewed_by_arena_user_id_arena_users_id_fk" FOREIGN KEY ("reviewed_by_arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forge_submissions" ADD CONSTRAINT "forge_submissions_approved_question_id_arena_questions_id_fk" FOREIGN KEY ("approved_question_id") REFERENCES "public"."arena_questions"("id") ON DELETE set null ON UPDATE no action;