CREATE TABLE "arena_resources" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "profile_wallets" CASCADE;--> statement-breakpoint
DROP TABLE "verse_guardians" CASCADE;--> statement-breakpoint
DROP TABLE "verse_recovery_requests" CASCADE;--> statement-breakpoint
DROP TABLE "wallets" CASCADE;--> statement-breakpoint
DROP TABLE "wallet_accounts" CASCADE;--> statement-breakpoint
DROP TABLE "wallet_controllers" CASCADE;--> statement-breakpoint
DROP TABLE "connected_wallets" CASCADE;--> statement-breakpoint
DROP TABLE "supported_chains" CASCADE;--> statement-breakpoint
ALTER TABLE "arena_questions" ADD COLUMN "explanation" text;--> statement-breakpoint
ALTER TABLE "arena_questions" ADD COLUMN "resource_id" text;--> statement-breakpoint
ALTER TABLE "arena_resources" ADD CONSTRAINT "arena_resources_course_id_arena_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."arena_courses"("id") ON DELETE cascade ON UPDATE no action;