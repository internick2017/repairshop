import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";



export const getCustomer = async (customerId: number) => {
    const customer = await db.select().from(customers).where(eq(customers.id, customerId));
    return customer[0];
}