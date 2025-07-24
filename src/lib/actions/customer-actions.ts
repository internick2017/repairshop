'use server';

import { action } from "@/lib/safe-actions";
import { customerInsertSchema } from "@/lib/zod-schemas/customer";
import { z } from "zod";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Schema for updating customers (all fields optional except id)
const customerUpdateSchema = customerInsertSchema.partial().extend({
  id: z.number().positive("Valid customer ID is required"),
});

// Schema for deleting customers
const customerDeleteSchema = z.object({
  id: z.number().positive("Valid customer ID is required"),
});

// Schema for getting customer by ID
const customerGetSchema = z.object({
  id: z.number().positive("Valid customer ID is required"),
});

// Schema for getting customers by status
const customersByStatusSchema = z.object({
  active: z.boolean().optional(),
});

// Create customer action
export const createCustomer = action
  .inputSchema(customerInsertSchema)
  .action(async ({ parsedInput }) => {
  try {
    const [newCustomer] = await db
      .insert(customers)
      .values(parsedInput)
      .returning();

    revalidatePath("/customers");
    revalidatePath("/");

    return {
      data: newCustomer,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return {
        serverError: "A customer with this email already exists.",
      };
    }
    throw error;
  }
});

// Update customer action
export const updateCustomer = action
  .inputSchema(customerUpdateSchema)
  .action(async ({ parsedInput }) => {
  try {
    const { id, ...updateData } = parsedInput;
    
    const [updatedCustomer] = await db
      .update(customers)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning();

    if (!updatedCustomer) {
      return {
        serverError: "Customer not found.",
      };
    }

    revalidatePath("/customers");
    revalidatePath(`/customers/${id}`);

    return {
      data: updatedCustomer,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return {
        serverError: "A customer with this email already exists.",
      };
    }
    throw error;
  }
});

// Delete customer action
export const deleteCustomer = action
  .inputSchema(customerDeleteSchema)
  .action(async ({ parsedInput }) => {
  try {
    const [deletedCustomer] = await db
      .delete(customers)
      .where(eq(customers.id, parsedInput.id))
      .returning();

    if (!deletedCustomer) {
      return {
        serverError: "Customer not found.",
      };
    }

    revalidatePath("/customers");
    revalidatePath("/");

    return {
      data: deletedCustomer,
    };
  } catch (error) {
    throw error;
  }
});

// Get customer by ID action
export const getCustomer = action
  .inputSchema(customerGetSchema)
  .action(async ({ parsedInput }) => {
  try {
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, parsedInput.id))
      .limit(1);

    if (!customer.length) {
      return {
        serverError: "Customer not found.",
      };
    }

    return {
      data: customer[0],
    };
  } catch (error) {
    throw error;
  }
});

// Get all customers action
export const getAllCustomers = action
  .inputSchema(customersByStatusSchema)
  .action(async ({ parsedInput }) => {
  try {
    let allCustomers;
    
    if (parsedInput.active !== undefined) {
      allCustomers = await db
        .select()
        .from(customers)
        .where(eq(customers.active, parsedInput.active));
    } else {
      allCustomers = await db
        .select()
        .from(customers);
    }

    return {
      data: allCustomers,
    };
  } catch (error) {
    throw error;
  }
});

// Toggle customer active status
export const toggleCustomerStatus = action
  .inputSchema(customerDeleteSchema)
  .action(async ({ parsedInput }) => {
  try {
    // First get the current customer to toggle the status
    const [currentCustomer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, parsedInput.id))
      .limit(1);

    if (!currentCustomer) {
      return {
        serverError: "Customer not found.",
      };
    }

    const [updatedCustomer] = await db
      .update(customers)
      .set({
        active: !currentCustomer.active,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, parsedInput.id))
      .returning();

    revalidatePath("/customers");
    revalidatePath(`/customers/${parsedInput.id}`);

    return {
      data: updatedCustomer,
    };
  } catch (error) {
    throw error;
  }
}); 