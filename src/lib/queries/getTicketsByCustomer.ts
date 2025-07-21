import { db } from "@/db";
import { tickets } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTicketsByCustomer(customerId: number) {
    return await db.select().from(tickets).where(eq(tickets.customerId, customerId));
} 