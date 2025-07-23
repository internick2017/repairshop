import { db } from "@/db";
import { customers } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getAllCustomers() {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
} 