import { db } from './index';
import { tickets } from './schema';
import { eq, inArray } from 'drizzle-orm';

async function assignTicketsToNick() {
    const userEmail = 'nickgranados01@gmail.com';
    
    try {
        console.log('🎯 Assigning tickets to nickgranados01@gmail.com...\n');
        
        // Get current unassigned tickets
        const unassignedTickets = await db
            .select({
                id: tickets.id,
                title: tickets.title,
                tech: tickets.tech
            })
            .from(tickets)
            .where(eq(tickets.tech, 'unassigned'))
            .limit(5);
        
        if (unassignedTickets.length === 0) {
            console.log('ℹ️ No unassigned tickets found');
            return;
        }
        
        console.log(`Found ${unassignedTickets.length} unassigned tickets:`);
        unassignedTickets.forEach(ticket => {
            console.log(`  - ID ${ticket.id}: ${ticket.title}`);
        });
        
        const ticketIds = unassignedTickets.map(ticket => ticket.id);
        
        // Assign the tickets
        const updatedTickets = await db
            .update(tickets)
            .set({ 
                tech: userEmail,
                updatedAt: new Date()
            })
            .where(inArray(tickets.id, ticketIds))
            .returning();
        
        console.log(`\n✅ Successfully assigned ${updatedTickets.length} tickets to ${userEmail}`);
        
        // Show the assigned tickets
        console.log('\n📋 Assigned tickets:');
        updatedTickets.forEach(ticket => {
            console.log(`  - ID ${ticket.id}: ${ticket.title}`);
        });
        
        console.log('\n🎉 Assignment completed!');
        
    } catch (error) {
        console.error('❌ Error assigning tickets:', error);
    }
}

// Run the script
assignTicketsToNick(); 