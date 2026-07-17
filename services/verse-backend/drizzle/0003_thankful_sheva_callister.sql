CREATE TYPE "public"."feed_post_type" AS ENUM('thought', 'question', 'announcement');--> statement-breakpoint
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
	"emoji" varchar(8) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_post_id_feed_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."feed_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_author_arena_user_id_arena_users_id_fk" FOREIGN KEY ("author_arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_posts" ADD CONSTRAINT "feed_posts_course_id_arena_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."arena_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_posts" ADD CONSTRAINT "feed_posts_author_arena_user_id_arena_users_id_fk" FOREIGN KEY ("author_arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_reactions" ADD CONSTRAINT "feed_reactions_post_id_feed_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."feed_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_reactions" ADD CONSTRAINT "feed_reactions_arena_user_id_arena_users_id_fk" FOREIGN KEY ("arena_user_id") REFERENCES "public"."arena_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "feed_reactions_unique" ON "feed_reactions" USING btree ("post_id","arena_user_id","emoji");