import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { tickets } from "@/db/schema";


export const ticketInsertSchema = createInsertSchema(tickets, { 
    id: () => z.union([z.number(), z.literal("new")]),
    title: () => z.string().min(1, { message: "Title is required" }),
    description: () => z.string().min(1, { message: "Description is required" }),
    completed: () => z.boolean(),
    tech: () => z.email({ message: "Invalid email address" }),
});


export const ticketSelectSchema = createSelectSchema(tickets);

export type InsertTicketSchema = z.infer<typeof ticketInsertSchema>;

export type SelectTicketSchema = z.infer<typeof ticketSelectSchema>;