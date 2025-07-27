'use server';

import { action } from "@/lib/safe-actions";
import { ticketInsertSchema } from "@/lib/zod-schemas/ticket";
import { z } from "zod";
import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Schema for updating tickets (all fields optional except id)
const ticketUpdateSchema = ticketInsertSchema.partial().extend({
  id: z.number().positive("Valid ticket ID is required"),
});

// Schema for deleting tickets
const ticketDeleteSchema = z.object({
  id: z.number().positive("Valid ticket ID is required"),
});

// Schema for getting ticket by ID
const ticketGetSchema = z.object({
  id: z.number().positive("Valid ticket ID is required"),
});

// Schema for getting tickets by customer
const ticketsByCustomerSchema = z.object({
  customerId: z.number().positive("Valid customer ID is required"),
});

// Schema for getting tickets by status
const ticketsByStatusSchema = z.object({
  completed: z.boolean().optional(),
  tech: z.string().optional(),
});

// Schema for assigning ticket to tech
const assignTicketSchema = z.object({
  id: z.number().positive("Valid ticket ID is required"),
  tech: z.string().min(1, "Tech assignment is required"),
});

// Schema for completing/uncompleting ticket
const toggleTicketStatusSchema = z.object({
  id: z.number().positive("Valid ticket ID is required"),
});

// Create ticket action
export const createTicket = action
  .inputSchema(ticketInsertSchema)
  .action(async ({ parsedInput }) => {
  try {
    // Verify customer exists
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, parsedInput.customerId))
      .limit(1);

    if (!customer.length) {
      return {
        serverError: "Customer not found.",
      };
    }

     const { id: _id, ...insertData } = parsedInput;
    
    const [newTicket] = await db
      .insert(tickets)
      .values(insertData)
      .returning();

    revalidatePath("/tickets");
    revalidatePath(`/customers/${parsedInput.customerId}`);
    revalidatePath("/");

    return {
      data: newTicket,
    };
  } catch (error) {
    throw error;
  }
});

// Update ticket action
export const updateTicket = action
  .inputSchema(ticketUpdateSchema)
  .action(async ({ parsedInput }) => {
  try {
    const { id, ...updateData } = parsedInput;
    
    const [updatedTicket] = await db
      .update(tickets)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(tickets.id, id))
      .returning();

    if (!updatedTicket) {
      return {
        serverError: "Ticket not found.",
      };
    }

    revalidatePath("/tickets");
    revalidatePath(`/tickets/${id}`);
    revalidatePath(`/customers/${updatedTicket.customerId}`);

    return {
      data: updatedTicket,
    };
  } catch (error) {
    throw error;
  }
});

// Delete ticket action
export const deleteTicket = action
  .inputSchema(ticketDeleteSchema)
  .action(async ({ parsedInput }) => {
  try {
    const { id } = parsedInput;
    
    const [deletedTicket] = await db
      .delete(tickets)
      .where(eq(tickets.id, id))
      .returning();

    if (!deletedTicket) {
      return {
        serverError: "Ticket not found.",
      };
    }

    revalidatePath("/tickets");
    revalidatePath(`/customers/${deletedTicket.customerId}`);
    revalidatePath("/");

    return {
      data: deletedTicket,
    };
  } catch (error) {
    throw error;
  }
});

// Get ticket by ID action
export const getTicket = action
  .inputSchema(ticketGetSchema)
  .action(async ({ parsedInput }) => {
  try {
    const { id } = parsedInput;
    
    const ticket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, id))
      .limit(1);

    if (!ticket.length) {
      return {
        serverError: "Ticket not found.",
      };
    }

    return {
      data: ticket[0],
    };
  } catch (error) {
    throw error;
  }
});

// Get all tickets action
export const getAllTickets = action
  .inputSchema(ticketsByStatusSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { completed, tech } = parsedInput;
      
      // Build where conditions
      const whereConditions = [];
      
      if (completed !== undefined) {
        whereConditions.push(eq(tickets.completed, completed));
      }
      
      if (tech) {
        whereConditions.push(eq(tickets.tech, tech));
      }

      let allTickets;
      
      if (whereConditions.length > 0) {
        // Apply where conditions using 'and' for multiple conditions
        allTickets = await db
          .select()
          .from(tickets)
          .where(whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions))
          .orderBy(desc(tickets.createdAt));
      } else {
        // No filters, get all tickets
        allTickets = await db
          .select()
          .from(tickets)
          .orderBy(desc(tickets.createdAt));
      }

      return {
        data: allTickets,
      };
    } catch (error) {
      throw error;
    }
  });

// Get tickets by customer action
export const getTicketsByCustomer = action
  .inputSchema(ticketsByCustomerSchema)
  .action(async ({ parsedInput }) => {
  try {
    const { customerId } = parsedInput;
    
    const customerTickets = await db
      .select()
      .from(tickets)
      .where(eq(tickets.customerId, customerId))
      .orderBy(desc(tickets.createdAt));

    return {
      data: customerTickets,
    };
  } catch (error) {
    throw error;
  }
});

// Assign ticket to tech action
export const assignTicket = action
  .inputSchema(assignTicketSchema)
  .action(async ({ parsedInput }) => {
  try {
    const { id, tech } = parsedInput;
    
    const [updatedTicket] = await db
      .update(tickets)
      .set({
        tech,
        updatedAt: new Date(),
      })
      .where(eq(tickets.id, id))
      .returning();

    if (!updatedTicket) {
      return {
        serverError: "Ticket not found.",
      };
    }

    revalidatePath("/tickets");
    revalidatePath(`/tickets/${id}`);

    return {
      data: updatedTicket,
    };
  } catch (error) {
    throw error;
  }
});

// Toggle ticket completion status
export const toggleTicketStatus = action
  .inputSchema(toggleTicketStatusSchema)
  .action(async ({ parsedInput }) => {
  try {
    const { id } = parsedInput;
    
    // First get the current ticket to toggle the status
    const [currentTicket] = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, id))
      .limit(1);

    if (!currentTicket) {
      return {
        serverError: "Ticket not found.",
      };
    }

    const [updatedTicket] = await db
      .update(tickets)
      .set({
        completed: !currentTicket.completed,
        updatedAt: new Date(),
      })
      .where(eq(tickets.id, id))
      .returning();

    revalidatePath("/tickets");
    revalidatePath(`/tickets/${id}`);
    revalidatePath(`/customers/${updatedTicket.customerId}`);

    return {
      data: updatedTicket,
    };
  } catch (error) {
    throw error;
  }
}); 