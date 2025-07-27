import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function searchTickets(query: string) {
  if (!query.trim()) {
    return [];
  }

  const searchTerm = `%${query.trim()}%`;

  try {
    const results = await db
      .select({
        id: tickets.id,
        title: tickets.title,
        description: tickets.description,
        completed: tickets.completed,
        tech: tickets.tech,
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt,
        customerId: tickets.customerId,
        customerFirstName: customers.firstName,
        customerLastName: customers.lastName,
        customerEmail: customers.email,
        customerPhone: customers.phone,
      })
      .from(tickets)
      .leftJoin(customers, tickets.customerId === customers.id)
      .where(
        or(
          ilike(tickets.title, searchTerm),
          ilike(tickets.description, searchTerm),
          ilike(customers.firstName, searchTerm),
          ilike(customers.lastName, searchTerm),
          sql`CONCAT(${customers.firstName}, ' ', ${customers.lastName}) ILIKE ${searchTerm}`,
          ilike(customers.email, searchTerm)
        )
      )
      .orderBy(tickets.createdAt);

    return results;
  } catch (error) {
    console.error("Error searching tickets:", error);
    throw new Error("Failed to search tickets");
  }
} 