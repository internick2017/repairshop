import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { ilike, or, eq, sql, desc } from "drizzle-orm";

export interface SearchTicketsParams {
  query: string;
  page?: number;
  pageSize?: number;
}

export interface SearchTicketsResult {
  data: any[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function searchTickets({
  query,
  page = 1,
  pageSize = 10,
}: SearchTicketsParams): Promise<SearchTicketsResult> {
  if (!query.trim()) {
    return {
      data: [],
      totalCount: 0,
      page,
      pageSize,
      totalPages: 0,
    };
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
      .leftJoin(customers, eq(tickets.customerId, customers.id))
      .where(
        or(
          ilike(tickets.title, searchTerm),
          ilike(tickets.description, searchTerm),
          ilike(tickets.tech, searchTerm),
          ilike(customers.firstName, searchTerm),
          ilike(customers.lastName, searchTerm),
          ilike(customers.email, searchTerm),
          sql`LOWER(${customers.firstName} || ' ' || ${customers.lastName}) LIKE LOWER(${searchTerm})`
        )
      )
      .orderBy(desc(tickets.createdAt));

    // Get total count for pagination
    const countQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(tickets)
      .leftJoin(customers, eq(tickets.customerId, customers.id))
      .where(
        or(
          ilike(tickets.title, searchTerm),
          ilike(tickets.description, searchTerm),
          ilike(tickets.tech, searchTerm),
          ilike(customers.firstName, searchTerm),
          ilike(customers.lastName, searchTerm),
          ilike(customers.email, searchTerm),
          sql`LOWER(${customers.firstName} || ' ' || ${customers.lastName}) LIKE LOWER(${searchTerm})`
        )
      );

    const totalCount = Number(countQuery[0]?.count || 0);
    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + pageSize);

    return {
      data: paginatedResults,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    console.error("Error searching tickets:", error);
    throw new Error("Failed to search tickets");
  }
} 