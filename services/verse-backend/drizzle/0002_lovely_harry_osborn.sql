CREATE TYPE "public"."showdown_mode" AS ENUM('tournament', 'duel');--> statement-breakpoint
ALTER TYPE "public"."showdown_status" ADD VALUE 'challenge_pending' BEFORE 'live';--> statement-breakpoint
ALTER TABLE "showdowns" ADD COLUMN "mode" "showdown_mode" DEFAULT 'tournament' NOT NULL;