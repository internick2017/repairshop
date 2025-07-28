import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tickets } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { ticketInsertSchema } from "@/lib/zod-schemas/ticket";
import { getAllTickets } from "@/lib/queries/getAllTickets";
import * as Sentry from "@sentry/nextjs";

export async function GET(request: NextRequest) {
    try {
        // Check authentication and permissions
        const { getUser, getPermission } = getKindeServerSession();
        const [user, managerPermission] = await Promise.all([
            getUser(),
            getPermission("manager")
        ]);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const isManager = managerPermission?.isGranted || false;
        
        // Fetch all tickets
        const allTickets = await getAllTickets();
        
        // Filter tickets based on user permissions
        const tickets = isManager 
            ? allTickets // Managers see all tickets
            : allTickets.filter(ticket => ticket.tech === user.email); // Regular employees see only their tickets

        return NextResponse.json({ 
            tickets,
            count: tickets.length,
            isManager,
            userEmail: user.email,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        Sentry.captureException(error, {
            tags: { component: 'TicketsAPI', action: 'fetch_tickets' }
        });

        console.error('Error fetching tickets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tickets' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const { getUser, getPermission } = getKindeServerSession();
        const [user, managerPermission] = await Promise.all([
            getUser(),
            getPermission("manager")
        ]);
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const isManager = managerPermission?.isGranted || false;
        const body = await request.json();
        
        // Validate input
        const validatedData = ticketInsertSchema.parse(body);
        
        // Permission check: Regular employees can only assign themselves
        if (!isManager && validatedData.tech !== user.email && validatedData.tech !== "unassigned") {
            return NextResponse.json({ 
                error: "You can only assign yourself to tickets" 
            }, { status: 403 });
        }
        
        // Create new ticket
        const newTicket = await db.insert(tickets).values({
            customerId: validatedData.customerId,
            title: validatedData.title,
            description: validatedData.description,
            completed: validatedData.completed,
            tech: validatedData.tech,
        }).returning();

        return NextResponse.json({ 
            success: true, 
            ticket: newTicket[0] 
        });

    } catch (error) {
        Sentry.captureException(error, {
            tags: { component: 'TicketsAPI', action: 'create_ticket' },
            extra: { body: await request.text() }
        });

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        // Check authentication
        const { getUser, getPermission } = getKindeServerSession();
        const [user, managerPermission] = await Promise.all([
            getUser(),
            getPermission("manager")
        ]);
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const isManager = managerPermission?.isGranted || false;
        const body = await request.json();
        
        // Validate input
        const validatedData = ticketInsertSchema.parse(body);
        
        if (!validatedData.id || validatedData.id === "new") {
            return NextResponse.json({ error: "Invalid ticket ID" }, { status: 400 });
        }

        // Permission check: Regular employees can only assign themselves
        if (!isManager && validatedData.tech !== user.email && validatedData.tech !== "unassigned") {
            return NextResponse.json({ 
                error: "You can only assign yourself to tickets" 
            }, { status: 403 });
        }

        // Update existing ticket
        const updatedTicket = await db.update(tickets)
            .set({
                customerId: validatedData.customerId,
                title: validatedData.title,
                description: validatedData.description,
                completed: validatedData.completed,
                tech: validatedData.tech,
                updatedAt: new Date(),
            })
            .where(eq(tickets.id, validatedData.id as number))
            .returning();

        if (updatedTicket.length === 0) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            ticket: updatedTicket[0] 
        });

    } catch (error) {
        Sentry.captureException(error, {
            tags: { component: 'TicketsAPI', action: 'update_ticket' },
            extra: { body: await request.text() }
        });

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 