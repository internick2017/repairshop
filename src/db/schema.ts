import { pgTable, serial, varchar, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const customers = pgTable("customers", {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 255 }).notNull(),
    address1: varchar("address1", { length: 255 }).notNull(),
    address2: varchar("address2", { length: 255 }),
    city: varchar("city", { length: 255 }).notNull(),
    state: varchar("state", { length: 255 }).notNull(), // Increased from 2 to handle full state names
    zip: varchar("zip", { length: 10 }).notNull(),
    country: varchar("country", { length: 10 }).notNull(),
    notes: text("notes"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
    emailIdx: index("customers_email_idx").on(table.email),
    activeIdx: index("customers_active_idx").on(table.active),
}));

export const tickets = pgTable("tickets", {
    id: serial("id").primaryKey(),
    customerId: integer("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    completed: boolean("completed").notNull().default(false),
    tech: varchar("tech", { length: 255 }).notNull().default("unassigned"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
    customerIdIdx: index("tickets_customer_id_idx").on(table.customerId),
    completedIdx: index("tickets_completed_idx").on(table.completed),
    techIdx: index("tickets_tech_idx").on(table.tech),
}));

// create relations
export const customerRelations = relations(customers, ({ many }) => ({
    tickets: many(tickets),
}));

export const ticketRelations = relations(tickets, ({ one }) => ({
    customer: one(customers, {
        fields: [tickets.customerId],
        references: [customers.id],
    }),
}));