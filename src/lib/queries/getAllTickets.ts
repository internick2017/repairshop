import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getAllTickets() {
    return await db
        .select({
            id: tickets.id,
            title: tickets.title,
            description: tickets.description,
            completed: tickets.completed,
            tech: tickets.tech,
            kindeUserId: tickets.kindeUserId,
            createdAt: tickets.createdAt,
            updatedAt: tickets.updatedAt,
            customerId: tickets.customerId,
            customer: {
                id: customers.id,
                firstName: customers.firstName,
                lastName: customers.lastName,
                email: customers.email,
                phone: customers.phone,
            }
        })
        .from(tickets)
        .leftJoin(customers, eq(tickets.customerId, customers.id))
        .orderBy(desc(tickets.createdAt));
} 