"use server";

import { action } from "@/lib/safe-actions";
import { z } from "zod";
import { searchCustomers } from "@/lib/queries/searchCustomers";
import { searchTickets } from "@/lib/queries/searchTickets";
import { sanitizeText } from "@/lib/sanitization";
import { withRateLimit, searchRateLimiter } from "@/lib/rate-limit";

// Search schemas
const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  page: z.number().min(1).optional().default(1),
  pageSize: z.number().min(1).max(100).optional().default(10),
});

// Customer search action
export const searchCustomersAction = action
  .inputSchema(searchSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Apply rate limiting
      return await withRateLimit(searchRateLimiter, async () => {
        // Sanitize search query to prevent injection
        const sanitizedQuery = sanitizeText(parsedInput.query);
        const results = await searchCustomers({
          query: sanitizedQuery,
          page: parsedInput.page,
          pageSize: parsedInput.pageSize,
        });
        return { data: results };
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("rate limit")) {
        return { serverError: error.message };
      }
      return { serverError: "Failed to search customers" };
    }
  });

// Ticket search action
export const searchTicketsAction = action
  .inputSchema(searchSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Apply rate limiting
      return await withRateLimit(searchRateLimiter, async () => {
        // Sanitize search query to prevent injection
        const sanitizedQuery = sanitizeText(parsedInput.query);
        const results = await searchTickets({
          query: sanitizedQuery,
          page: parsedInput.page,
          pageSize: parsedInput.pageSize,
        });
        return { data: results };
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("rate limit")) {
        return { serverError: error.message };
      }
      return { serverError: "Failed to search tickets" };
    }
  }); 