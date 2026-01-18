CREATE TABLE "arena_schools" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"short_name" varchar(32),
	"logo" varchar(512),
	"country" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "arena_schools_name_unique" UNIQUE("name"),
	CONSTRAINT "arena_schools_short_name_unique" UNIQUE("short_name")
);
--> statement-breakpoint
CREATE TABLE "arena_users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" varchar(32) NOT NULL,
	"email" varchar(255),
	"avatar" varchar(512),
	"school_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "arena_users_username_unique" UNIQUE("username"),
	CONSTRAINT "arena_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "arena_users" ADD CONSTRAINT "arena_users_school_id_arena_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."arena_schools"("id") ON DELETE cascade ON UPDATE no action;