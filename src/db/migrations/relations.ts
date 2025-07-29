import { relations } from "drizzle-orm/relations";
import { customers, tickets } from "./schema";

export const ticketsRelations = relations(tickets, ({one}) => ({
	customer: one(customers, {
		fields: [tickets.customerId],
		references: [customers.id]
	}),
}));

export const customersRelations = relations(customers, ({many}) => ({
	tickets: many(tickets),
}));