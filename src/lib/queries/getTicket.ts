import { db } from "@/db";
import { tickets } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function getTicket(ticketId: number) {
    const ticket = await db.select().from(tickets).where(eq(tickets.id, ticketId));
    return ticket[0];
}