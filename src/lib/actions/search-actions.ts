"use server";

import { action } from "@/lib/safe-actions";
import { z } from "zod";
import { searchCustomers } from "@/lib/queries/searchCustomers";
import { searchTickets } from "@/lib/queries/searchTickets";

// Search schemas
const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

// Customer search action
export const searchCustomersAction = action
  .inputSchema(searchSchema)
  .action(async ({ parsedInput }) => {
    try {
      const results = await searchCustomers(parsedInput.query);
      return { data: results };
    } catch (error) {
      return { serverError: "Failed to search customers" };
    }
  });

// Ticket search action
export const searchTicketsAction = action
  .inputSchema(searchSchema)
  .action(async ({ parsedInput }) => {
    try {
      const results = await searchTickets(parsedInput.query);
      return { data: results };
    } catch (error) {
      return { serverError: "Failed to search tickets" };
    }
  }); 