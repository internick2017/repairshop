"use server";

import { action } from "@/lib/safe-actions";
import { z } from "zod";
import { searchCustomers } from "@/lib/queries/searchCustomers";
import { searchTickets } from "@/lib/queries/searchTickets";
import { sanitizeText } from "@/lib/sanitization";

// Search schemas
const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

// Customer search action
export const searchCustomersAction = action
  .inputSchema(searchSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Sanitize search query to prevent injection
      const sanitizedQuery = sanitizeText(parsedInput.query);
      const results = await searchCustomers(sanitizedQuery);
      return { data: results };
    } catch {
      return { serverError: "Failed to search customers" };
    }
  });

// Ticket search action
export const searchTicketsAction = action
  .inputSchema(searchSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Sanitize search query to prevent injection
      const sanitizedQuery = sanitizeText(parsedInput.query);
      const results = await searchTickets(sanitizedQuery);
      return { data: results };
    } catch {
      return { serverError: "Failed to search tickets" };
    }
  }); 