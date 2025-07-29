import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { tickets } from "@/db/schema";


export const ticketInsertSchema = createInsertSchema(tickets, { 
    id: () => z.union([z.number(), z.literal("new")]),
    title: () => z.string().min(1, { message: "Title is required" }),
    description: () => z.string().min(1, { message: "Description is required" }),
    completed: () => z.boolean(),
    tech: () => z.union([
        z.literal("unassigned"),
        z.string().email({ message: "Invalid email address" })
    ]),
    kindeUserId: () => z.string().optional(),
});


export const ticketSelectSchema = createSelectSchema(tickets);

export type InsertTicketSchema = z.infer<typeof ticketInsertSchema>;

export type SelectTicketSchema = z.infer<typeof ticketSelectSchema>;