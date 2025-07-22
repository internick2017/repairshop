ALTER TABLE "tickets" DROP CONSTRAINT "tickets_customer_id_customers_id_fk";
--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "state" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "customer_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "customers_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "customers_active_idx" ON "customers" USING btree ("active");--> statement-breakpoint
CREATE INDEX "tickets_customer_id_idx" ON "tickets" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "tickets_completed_idx" ON "tickets" USING btree ("completed");--> statement-breakpoint
CREATE INDEX "tickets_tech_idx" ON "tickets" USING btree ("tech");