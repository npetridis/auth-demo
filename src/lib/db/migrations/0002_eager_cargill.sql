ALTER TABLE "users_table" DROP CONSTRAINT "users_table_email_unique";--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "username" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "age" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "ethereum_address" varchar(42);--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users_table" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_eth_addr_unique" ON "users_table" USING btree ("ethereum_address");