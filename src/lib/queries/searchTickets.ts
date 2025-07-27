import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { ilike, or, eq } from "drizzle-orm";

export async function searchTickets(query: string) {
  if (!query.trim()) {
    return [];
  }

  const searchTerm = `%${query.trim()}%`;

  try {
    // First, get all tickets with their customer data
    const allTickets = await db
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
      .leftJoin(customers, eq(tickets.customerId, customers.id))
      .orderBy(tickets.createdAt);

    // Then filter the results in JavaScript
    const filteredResults = allTickets.filter(ticket => {
      const searchLower = query.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        (ticket.customerFirstName && ticket.customerFirstName.toLowerCase().includes(searchLower)) ||
        (ticket.customerLastName && ticket.customerLastName.toLowerCase().includes(searchLower)) ||
        (ticket.customerEmail && ticket.customerEmail.toLowerCase().includes(searchLower))
      );
    });

    return filteredResults;
  } catch (error) {
    console.error("Error searching tickets:", error);
    throw new Error("Failed to search tickets");
  }
} 