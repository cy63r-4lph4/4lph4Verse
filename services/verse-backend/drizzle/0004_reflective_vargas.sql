ALTER TABLE "feed_reactions" RENAME COLUMN "emoji" TO "type";--> statement-breakpoint
DROP INDEX "feed_reactions_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "feed_reactions_unique" ON "feed_reactions" USING btree ("post_id","arena_user_id","type");