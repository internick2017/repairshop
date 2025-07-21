import { db } from './index';
import { customers, tickets } from './schema';

// Sample customer data
const sampleCustomers = [
    {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@email.com",
        phone: "555-0123",
        address1: "123 Main St",
        address2: "Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "US",
        notes: "Preferred customer, always pays on time"
    },
    {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@email.com",
        phone: "555-0456",
        address1: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        zip: "90210",
        country: "US",
        notes: "Business owner, multiple devices"
    },
    {
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.brown@email.com",
        phone: "555-0789",
        address1: "789 Pine Road",
        address2: "Suite 200",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        country: "US",
        notes: null
    },
    {
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.davis@email.com",
        phone: "555-0321",
        address1: "321 Elm Street",
        city: "Houston",
        state: "TX",
        zip: "77001",
        country: "US",
        notes: "Student discount applied"
    },
    {
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@email.com",
        phone: "555-0654",
        address1: "654 Maple Drive",
        city: "Phoenix",
        state: "AZ",
        zip: "85001",
        country: "US",
        notes: "Senior citizen, needs extra assistance"
    },
    {
        firstName: "Lisa",
        lastName: "Martinez",
        email: "lisa.martinez@email.com",
        phone: "555-0987",
        address1: "987 Cedar Lane",
        city: "Philadelphia",
        state: "PA",
        zip: "19101",
        country: "US",
        notes: "Repeat customer, laptop specialist needed"
    },
    {
        firstName: "Robert",
        lastName: "Anderson",
        email: "robert.anderson@email.com",
        phone: "555-0147",
        address1: "147 Birch Boulevard",
        city: "San Antonio",
        state: "TX",
        zip: "78201",
        country: "US",
        notes: null
    },
    {
        firstName: "Jennifer",
        lastName: "Taylor",
        email: "jennifer.taylor@email.com",
        phone: "555-0258",
        address1: "258 Spruce Street",
        address2: "Unit 15",
        city: "San Diego",
        state: "CA",
        zip: "92101",
        country: "US",
        notes: "Gaming PC enthusiast"
    },
    {
        firstName: "James",
        lastName: "Thomas",
        email: "james.thomas@email.com",
        phone: "555-0369",
        address1: "369 Willow Way",
        city: "Dallas",
        state: "TX",
        zip: "75201",
        country: "US",
        notes: "Small business owner, multiple workstations"
    },
    {
        firstName: "Amanda",
        lastName: "White",
        email: "amanda.white@email.com",
        phone: "555-0741",
        address1: "741 Poplar Place",
        city: "San Jose",
        state: "CA",
        zip: "95101",
        country: "US",
        notes: "Graphic designer, Mac specialist preferred"
    }
];

// Sample ticket data
const sampleTickets = [
    {
        customerId: 1, // John Smith
        title: "Laptop won't turn on",
        description: "Customer reports that their Dell laptop suddenly stopped turning on. No lights, no fan noise. Was working fine yesterday evening.",
        completed: false,
        tech: "Alex Rodriguez"
    },
    {
        customerId: 1, // John Smith
        title: "Software installation",
        description: "Install Microsoft Office suite and set up email client. Customer needs training on new features.",
        completed: true,
        tech: "Sarah Kim"
    },
    {
        customerId: 2, // Sarah Johnson
        title: "Desktop running very slow",
        description: "Business computer taking 10+ minutes to boot. Multiple applications freezing. Possible malware infection.",
        completed: false,
        tech: "Mike Chen"
    },
    {
        customerId: 3, // Michael Brown
        title: "Data recovery from failed hard drive",
        description: "Customer's hard drive crashed. Contains important business documents. Drive makes clicking sounds.",
        completed: false,
        tech: "Alex Rodriguez"
    },
    {
        customerId: 4, // Emily Davis
        title: "Screen replacement - MacBook Air",
        description: "Cracked screen on 13-inch MacBook Air (2022). Customer dropped it. Touch and keyboard still work.",
        completed: true,
        tech: "Maria Lopez"
    },
    {
        customerId: 5, // David Wilson
        title: "Printer setup and troubleshooting",
        description: "Help customer connect wireless printer to home network. Set up scanning functionality.",
        completed: true,
        tech: "Sarah Kim"
    },
    {
        customerId: 6, // Lisa Martinez
        title: "Laptop overheating issues",
        description: "Customer reports laptop gets very hot and shuts down during video calls. Fan noise is excessive.",
        completed: false,
        tech: "Mike Chen"
    },
    {
        customerId: 7, // Robert Anderson
        title: "Virus removal and cleanup",
        description: "Multiple pop-ups and redirects. Browser homepage changed. Computer performance degraded significantly.",
        completed: true,
        tech: "Alex Rodriguez"
    },
    {
        customerId: 8, // Jennifer Taylor
        title: "Gaming PC won't boot",
        description: "Custom built gaming PC showing blue screen on startup. Recent graphics card upgrade. All RGB lights work.",
        completed: false,
        tech: "unassigned"
    },
    {
        customerId: 9, // James Thomas
        title: "Network connectivity issues",
        description: "Office computers randomly losing internet connection. Affects productivity. Router was recently replaced.",
        completed: false,
        tech: "Maria Lopez"
    },
    {
        customerId: 10, // Amanda White
        title: "MacBook Pro keyboard replacement",
        description: "Several keys not responding (J, K, L keys). Customer is a graphic designer and needs quick turnaround.",
        completed: false,
        tech: "Maria Lopez"
    },
    {
        customerId: 2, // Sarah Johnson
        title: "Backup solution setup",
        description: "Set up automated backup system for business data. Customer wants both local and cloud backup options.",
        completed: true,
        tech: "Sarah Kim"
    },
    {
        customerId: 5, // David Wilson
        title: "Email not working",
        description: "Customer cannot send emails. Receiving works fine. Error message about SMTP server settings.",
        completed: true,
        tech: "Mike Chen"
    },
    {
        customerId: 8, // Jennifer Taylor
        title: "RAM upgrade consultation",
        description: "Customer wants to upgrade gaming PC RAM from 16GB to 32GB. Needs compatibility check and installation.",
        completed: false,
        tech: "unassigned"
    }
];

export async function seedDatabase() {
    try {
        console.log("🌱 Starting database seeding...");

        // Insert customers
        console.log("📝 Inserting customers...");
        const insertedCustomers = await db.insert(customers).values(sampleCustomers).returning();
        console.log(`✅ Inserted ${insertedCustomers.length} customers`);

        // Insert tickets (using the actual customer IDs from the database)
        console.log("🎫 Inserting tickets...");
        const ticketsWithCorrectIds = sampleTickets.map((ticket, index) => ({
            ...ticket,
            customerId: insertedCustomers[ticket.customerId - 1].id // Map to actual database IDs
        }));
        
        const insertedTickets = await db.insert(tickets).values(ticketsWithCorrectIds).returning();
        console.log(`✅ Inserted ${insertedTickets.length} tickets`);

        console.log("🎉 Database seeding completed successfully!");
        
        return {
            customers: insertedCustomers,
            tickets: insertedTickets
        };
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        throw error;
    }
}

// Function to clear all data (useful for testing)
export async function clearDatabase() {
    try {
        console.log("🧹 Clearing database...");
        
        await db.delete(tickets);
        console.log("✅ Cleared tickets table");
        
        await db.delete(customers);
        console.log("✅ Cleared customers table");
        
        console.log("🎉 Database cleared successfully!");
    } catch (error) {
        console.error("❌ Error clearing database:", error);
        throw error;
    }
}

// Export the sample data for other uses
export { sampleCustomers, sampleTickets }; 