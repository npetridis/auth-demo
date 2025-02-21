ALTER TABLE "users_table" RENAME COLUMN "name" TO "username";--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "password_hash" varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;