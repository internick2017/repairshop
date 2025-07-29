CREATE TABLE "user_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"kinde_user_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'Regular User' NOT NULL,
	"permissions" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_permissions_kinde_user_id_unique" UNIQUE("kinde_user_id")
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "kinde_user_id" varchar(255);--> statement-breakpoint
CREATE INDEX "user_permissions_kinde_user_id_idx" ON "user_permissions" USING btree ("kinde_user_id");--> statement-breakpoint
CREATE INDEX "user_permissions_email_idx" ON "user_permissions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_permissions_role_idx" ON "user_permissions" USING btree ("role");--> statement-breakpoint
CREATE INDEX "tickets_kinde_user_id_idx" ON "tickets" USING btree ("kinde_user_id");