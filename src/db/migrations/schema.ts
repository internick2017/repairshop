import { pgTable, index, foreignKey, serial, integer, varchar, text, boolean, timestamp, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const tickets = pgTable("tickets", {
	id: serial().primaryKey().notNull(),
	customerId: integer("customer_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	completed: boolean().default(false).notNull(),
	tech: varchar({ length: 255 }).default('unassigned').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("tickets_completed_idx").using("btree", table.completed.asc().nullsLast().op("bool_ops")),
	index("tickets_customer_id_idx").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	index("tickets_tech_idx").using("btree", table.tech.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "tickets_customer_id_customers_id_fk"
		}).onDelete("cascade"),
]);

export const customers = pgTable("customers", {
	id: serial().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 255 }).notNull(),
	address1: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 255 }).notNull(),
	state: varchar({ length: 255 }).notNull(),
	zip: varchar({ length: 10 }).notNull(),
	notes: text(),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	address2: varchar({ length: 255 }),
	country: varchar({ length: 10 }).notNull(),
}, (table) => [
	index("customers_active_idx").using("btree", table.active.asc().nullsLast().op("bool_ops")),
	index("customers_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	unique("customers_email_unique").on(table.email),
]);
