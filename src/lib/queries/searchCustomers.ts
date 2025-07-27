import { db } from "@/db";
import { customers } from "@/db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function searchCustomers(query: string) {
  if (!query.trim()) {
    return [];
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
          sql`CONCAT(${customers.firstName}, ' ', ${customers.lastName}) ILIKE ${searchTerm}`,
          ilike(customers.email, searchTerm),
          ilike(customers.phone, searchTerm)
        )
      )
      .orderBy(customers.firstName, customers.lastName);

    return results;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw new Error("Failed to search customers");
  }
} 