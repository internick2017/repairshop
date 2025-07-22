import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { customers } from "@/db/schema";

export const customerInsertSchema = createInsertSchema(customers, {
    firstName: () => z.string().min(1, { message: "First name is required" }),
    lastName: () => z.string().min(1, { message: "Last name is required" }),
    email: () => z.email({ message: "Invalid email address" }),
    phone: () => z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" }),
    address1: () => z.string().min(1, { message: "Address is required" }),
    address2: () => z.string().optional(),
    city: () => z.string().min(1, { message: "City is required" }),
    state: () => z.string().min(1, { message: "State/Region is required" }),
    zip: () => z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Invalid ZIP code format" }),
    country: () => z.string().min(1, { message: "Country is required" }),
    notes: () => z.string().optional(),
    active: () => z.boolean(),
});

export const customerSelectSchema = createSelectSchema(customers);

export type InsertCustomerSchema = z.infer<typeof customerInsertSchema>;
export type SelectCustomerSchema = z.infer<typeof customerSelectSchema>;