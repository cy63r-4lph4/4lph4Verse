CREATE TABLE "verse_guardians" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"verse_id" varchar(255) NOT NULL,
	"guardian_address" varchar(42) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"epoch" integer DEFAULT 0 NOT NULL,
	"threshold" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verse_recovery_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"verse_id" varchar(255) NOT NULL,
	"recovery_type" varchar(32) NOT NULL,
	"pending_new_owner" varchar(42) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"eta" timestamp,
	"nonce" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verse_guardians" ADD CONSTRAINT "verse_guardians_verse_id_verse_profiles_id_fk" FOREIGN KEY ("verse_id") REFERENCES "public"."verse_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verse_recovery_requests" ADD CONSTRAINT "verse_recovery_requests_verse_id_verse_profiles_id_fk" FOREIGN KEY ("verse_id") REFERENCES "public"."verse_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unq_guardian_per_verse" ON "verse_guardians" USING btree ("verse_id","guardian_address","epoch");--> statement-breakpoint
CREATE INDEX "idx_verse_recovery" ON "verse_recovery_requests" USING btree ("verse_id","active");