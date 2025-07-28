import { db } from "@/db";
import { customers } from "@/db/schema";
import { ilike, or, sql } from "drizzle-orm";

export interface SearchCustomersParams {
  query: string;
  page?: number;
  pageSize?: number;
}

export interface SearchCustomersResult {
  data: any[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function searchCustomers({
  query,
  page = 1,
  pageSize = 10,
}: SearchCustomersParams): Promise<SearchCustomersResult> {
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
      .select()
      .from(customers)
      .where(
        or(
          ilike(customers.firstName, searchTerm),
          ilike(customers.lastName, searchTerm),
          sql`LOWER(${customers.firstName} || ' ' || ${customers.lastName}) LIKE LOWER(${searchTerm})`,
          ilike(customers.email, searchTerm),
          ilike(customers.phone, searchTerm)
        )
      )
      .orderBy(customers.firstName, customers.lastName);

    // Get total count for pagination
    const countQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(
        or(
          ilike(customers.firstName, searchTerm),
          ilike(customers.lastName, searchTerm),
          sql`LOWER(${customers.firstName} || ' ' || ${customers.lastName}) LIKE LOWER(${searchTerm})`,
          ilike(customers.email, searchTerm),
          ilike(customers.phone, searchTerm)
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
    console.error("Error searching customers:", error);
    throw new Error("Failed to search customers");
  }
} 