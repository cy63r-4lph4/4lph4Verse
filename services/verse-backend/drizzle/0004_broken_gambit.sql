CREATE TABLE "arena_resource_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"arena_user_id" text NOT NULL,
	"resource_id" text NOT NULL,
	"progress" smallint DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arena_resource_progress" ADD CONSTRAINT "arena_resource_progress_arena_user_id_arena_users_id_fk" FOREIGN KEY ("arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arena_resource_progress" ADD CONSTRAINT "arena_resource_progress_resource_id_arena_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."arena_resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "arena_resource_progress_user_resource_idx" ON "arena_resource_progress" USING btree ("arena_user_id","resource_id");