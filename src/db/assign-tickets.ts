import { db } from './index';
import { tickets } from './schema';
import { eq, inArray } from 'drizzle-orm';

export async function assignTicketsToUser(email: string, ticketIds: number[]) {
    try {
        console.log(`🎯 Assigning ${ticketIds.length} tickets to ${email}...`);
        
        // Update the specified tickets to assign them to the user
        const updatedTickets = await db
            .update(tickets)
            .set({ 
                tech: email,
                updatedAt: new Date()
            })
            .where(inArray(tickets.id, ticketIds))
            .returning();
        
        console.log(`✅ Successfully assigned ${updatedTickets.length} tickets to ${email}`);
        
        return updatedTickets;
    } catch (error) {
        console.error('❌ Error assigning tickets:', error);
        throw error;
    }
}

export async function assignUnassignedTicketsToUser(email: string, limit: number = 5) {
    try {
        console.log(`🎯 Assigning up to ${limit} unassigned tickets to ${email}...`);
        
        // First, get unassigned tickets
        const unassignedTickets = await db
            .select()
            .from(tickets)
            .where(eq(tickets.tech, 'unassigned'))
            .limit(limit);
        
        if (unassignedTickets.length === 0) {
            console.log('ℹ️ No unassigned tickets found');
            return [];
        }
        
        const ticketIds = unassignedTickets.map(ticket => ticket.id);
        
        // Update the tickets to assign them to the user
        const updatedTickets = await db
            .update(tickets)
            .set({ 
                tech: email,
                updatedAt: new Date()
            })
            .where(inArray(tickets.id, ticketIds))
            .returning();
        
        console.log(`✅ Successfully assigned ${updatedTickets.length} tickets to ${email}`);
        
        return updatedTickets;
    } catch (error) {
        console.error('❌ Error assigning unassigned tickets:', error);
        throw error;
    }
}

export async function assignRandomTicketsToUser(email: string, count: number = 3) {
    try {
        console.log(`🎯 Assigning ${count} random tickets to ${email}...`);
        
        // Get random tickets (excluding already assigned ones)
        const randomTickets = await db
            .select()
            .from(tickets)
            .where(eq(tickets.tech, 'unassigned'))
            .limit(count);
        
        if (randomTickets.length === 0) {
            console.log('ℹ️ No unassigned tickets available for random assignment');
            return [];
        }
        
        const ticketIds = randomTickets.map(ticket => ticket.id);
        
        // Update the tickets to assign them to the user
        const updatedTickets = await db
            .update(tickets)
            .set({ 
                tech: email,
                updatedAt: new Date()
            })
            .where(inArray(tickets.id, ticketIds))
            .returning();
        
        console.log(`✅ Successfully assigned ${updatedTickets.length} random tickets to ${email}`);
        
        return updatedTickets;
    } catch (error) {
        console.error('❌ Error assigning random tickets:', error);
        throw error;
    }
}

// Function to show current ticket assignments
export async function showTicketAssignments() {
    try {
        const allTickets = await db
            .select({
                id: tickets.id,
                title: tickets.title,
                tech: tickets.tech,
                completed: tickets.completed,
                customerId: tickets.customerId
            })
            .from(tickets)
            .orderBy(tickets.id);
        
        console.log('\n📊 Current Ticket Assignments:');
        console.log('ID | Title | Tech | Status');
        console.log('---|-------|------|--------');
        
        allTickets.forEach(ticket => {
            const status = ticket.completed ? '✅ Completed' : '⏳ Pending';
            console.log(`${ticket.id.toString().padStart(2)} | ${ticket.title.substring(0, 30).padEnd(30)} | ${ticket.tech.padEnd(20)} | ${status}`);
        });
        
        return allTickets;
    } catch (error) {
        console.error('❌ Error showing ticket assignments:', error);
        throw error;
    }
}

// Main execution function
async function main() {
    const userEmail = 'nickgranados01@gmail.com';
    
    try {
        console.log('🚀 Starting ticket assignment process...\n');
        
        // Show current assignments
        await showTicketAssignments();
        
        console.log('\n' + '='.repeat(50));
        
        // Option 1: Assign specific ticket IDs
        // const specificTicketIds = [1, 3, 5, 8, 10]; // Example ticket IDs
        // await assignTicketsToUser(userEmail, specificTicketIds);
        
        // Option 2: Assign unassigned tickets
        await assignUnassignedTicketsToUser(userEmail, 5);
        
        // Option 3: Assign random tickets
        // await assignRandomTicketsToUser(userEmail, 3);
        
        console.log('\n' + '='.repeat(50));
        
        // Show updated assignments
        await showTicketAssignments();
        
        console.log('\n🎉 Ticket assignment process completed!');
        
    } catch (error) {
        console.error('❌ Error in main process:', error);
    }
}

// Run the script if called directly
if (require.main === module) {
    main();
} 