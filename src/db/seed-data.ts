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
    },
    {
        firstName: "Carlos",
        lastName: "Rodriguez",
        email: "carlos.rodriguez@email.com",
        phone: "555-1234",
        address1: "890 Technology Park",
        city: "Miami",
        state: "FL",
        zip: "33101",
        country: "US",
        notes: "IT professional, needs advanced troubleshooting"
    },
    {
        firstName: "Elena",
        lastName: "Kim",
        email: "elena.kim@email.com",
        phone: "555-5678",
        address1: "234 Innovation Drive",
        address2: "Apt 7C",
        city: "Seattle",
        state: "WA",
        zip: "98101",
        country: "US",
        notes: "Software developer, multiple development machines"
    },
    {
        firstName: "Marcus",
        lastName: "Thompson",
        email: "marcus.thompson@email.com",
        phone: "555-9012",
        address1: "567 Creative Lane",
        city: "Atlanta",
        state: "GA",
        zip: "30301",
        country: "US",
        notes: "Music producer, specialized audio workstation needed"
    },
    {
        firstName: "Olivia",
        lastName: "Chen",
        email: "olivia.chen@email.com",
        phone: "555-3456",
        address1: "678 Research Circle",
        address2: "Unit 22",
        city: "Boston",
        state: "MA",
        zip: "02101",
        country: "US",
        notes: "University researcher, high-performance computing needs"
    },
    {
        firstName: "Ryan",
        lastName: "Patel",
        email: "ryan.patel@email.com",
        phone: "555-7890",
        address1: "345 Startup Boulevard",
        city: "San Francisco",
        state: "CA",
        zip: "94101",
        country: "US",
        notes: "Startup founder, critical business equipment"
    },
    {
        firstName: "Sophia",
        lastName: "Nakamura",
        email: "sophia.nakamura@email.com",
        phone: "555-2468",
        address1: "456 Innovation Street",
        address2: "Penthouse Suite",
        city: "Portland",
        state: "OR",
        zip: "97201",
        country: "US",
        notes: "Professional photographer, requires color-calibrated workstation"
    },
    {
        firstName: "Ahmed",
        lastName: "Hassan",
        email: "ahmed.hassan@email.com",
        phone: "555-1357",
        address1: "789 Entrepreneur Avenue",
        city: "Las Vegas",
        state: "NV",
        zip: "89101",
        country: "US",
        notes: "E-sports team manager, high-performance gaming infrastructure"
    },
    {
        firstName: "Isabella",
        lastName: "Martinez",
        email: "isabella.martinez@email.com",
        phone: "555-9876",
        address1: "234 Creative Plaza",
        address2: "Studio 3B",
        city: "New Orleans",
        state: "LA",
        zip: "70101",
        country: "US",
        notes: "Independent film director, video editing and rendering specialist"
    },
    {
        firstName: "Ethan",
        lastName: "Williams",
        email: "ethan.williams@email.com",
        phone: "555-4321",
        address1: "567 Medical Center Road",
        city: "Denver",
        state: "CO",
        zip: "80201",
        country: "US",
        notes: "Medical researcher, requires specialized scientific computing setup"
    },
    {
        firstName: "Zara",
        lastName: "Khan",
        email: "zara.khan@email.com",
        phone: "555-6543",
        address1: "890 Sustainable Tech Lane",
        address2: "Green Tech Hub",
        city: "Austin",
        state: "TX",
        zip: "73301",
        country: "US",
        notes: "Climate tech startup founder, eco-friendly computing solutions"
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
    },
    {
        customerId: 11, // Carlos Rodriguez
        title: "Network security assessment",
        description: "Comprehensive security audit for home office network. Concerns about potential vulnerabilities.",
        completed: false,
        tech: "Mike Chen"
    },
    {
        customerId: 12, // Elena Kim
        title: "Development machine performance optimization",
        description: "Multiple IDEs and virtual machines causing system slowdown. Need performance tuning and RAM upgrade.",
        completed: false,
        tech: "Sarah Kim"
    },
    {
        customerId: 13, // Marcus Thompson
        title: "Audio workstation setup",
        description: "Configure high-end audio interface, calibrate studio monitors, and optimize DAW performance.",
        completed: false,
        tech: "Alex Rodriguez"
    },
    {
        customerId: 14, // Olivia Chen
        title: "Research cluster maintenance",
        description: "Troubleshoot and maintain high-performance computing cluster. Update scientific computing software.",
        completed: false,
        tech: "Maria Lopez"
    },
    {
        customerId: 15, // Ryan Patel
        title: "Startup infrastructure consultation",
        description: "Evaluate and recommend IT infrastructure for growing startup. Cloud backup and security solutions.",
        completed: true,
        tech: "Sarah Kim"
    },
    {
        customerId: 11, // Carlos Rodriguez
        title: "Advanced malware removal",
        description: "Suspected advanced persistent threat. Forensic analysis and complete system restoration required.",
        completed: false,
        tech: "Alex Rodriguez"
    },
    {
        customerId: 12, // Elena Kim
        title: "Cross-platform development environment",
        description: "Set up development environment with Windows, macOS, and Linux virtual machines for cross-platform testing.",
        completed: true,
        tech: "Mike Chen"
    },
    {
        customerId: 13, // Marcus Thompson
        title: "Audio file recovery",
        description: "Recover critical audio project files from failed external hard drive. Time-sensitive professional work.",
        completed: false,
        tech: "Maria Lopez"
    },
    {
        customerId: 14, // Olivia Chen
        title: "Research data backup solution",
        description: "Implement redundant backup system for large scientific datasets. Ensure data integrity and quick recovery.",
        completed: true,
        tech: "Sarah Kim"
    },
    {
        customerId: 15, // Ryan Patel
        title: "Cloud migration consultation",
        description: "Assist in migrating startup infrastructure to cloud platform. Optimize costs and performance.",
        completed: true,
        tech: "Mike Chen"
    },
    {
        customerId: 16, // Sophia Nakamura
        title: "Color-calibrated workstation setup",
        description: "Professional photography workstation needs color-accurate monitors, color calibration tools, and high-end photo editing software configuration.",
        completed: false,
        tech: "Maria Lopez"
    },
    {
        customerId: 17, // Ahmed Hassan
        title: "E-sports team computer network",
        description: "Set up high-performance gaming network for professional e-sports team. Low-latency configuration, multiple gaming PCs, streaming setup.",
        completed: false,
        tech: "Mike Chen"
    },
    {
        customerId: 18, // Isabella Martinez
        title: "Video editing workstation overhaul",
        description: "Upgrade video editing workstation for independent film production. Requires GPU acceleration, large storage solution, and color grading tools.",
        completed: false,
        tech: "Alex Rodriguez"
    },
    {
        customerId: 19, // Ethan Williams
        title: "Scientific computing infrastructure",
        description: "Configure high-performance computing cluster for medical research. Requires specialized software, data security, and computational analysis tools.",
        completed: false,
        tech: "Sarah Kim"
    },
    {
        customerId: 20, // Zara Khan
        title: "Sustainable computing solution design",
        description: "Design energy-efficient computing infrastructure for climate tech startup. Focus on renewable energy integration and minimal carbon footprint.",
        completed: true,
        tech: "Mike Chen"
    },
    {
        customerId: 16, // Sophia Nakamura
        title: "Backup and archival system for photography",
        description: "Implement robust backup solution for large RAW image collections. Requires RAID storage, cloud sync, and metadata preservation.",
        completed: false,
        tech: "Sarah Kim"
    },
    {
        customerId: 17, // Ahmed Hassan
        title: "Streaming PC performance optimization",
        description: "Optimize streaming PC for professional e-sports broadcasting. Tune OBS settings, improve stream quality, and resolve encoding issues.",
        completed: true,
        tech: "Alex Rodriguez"
    },
    {
        customerId: 18, // Isabella Martinez
        title: "Portable editing rig for location work",
        description: "Build compact, high-performance laptop for on-location film editing. Must support 4K video editing and have long battery life.",
        completed: false,
        tech: "Maria Lopez"
    },
    {
        customerId: 19, // Ethan Williams
        title: "Medical data analysis workstation",
        description: "Configure specialized workstation for complex medical data analysis. Requires machine learning libraries, GPU acceleration, and secure data handling.",
        completed: true,
        tech: "Mike Chen"
    },
    {
        customerId: 20, // Zara Khan
        title: "Green tech server room optimization",
        description: "Redesign server room for maximum energy efficiency. Implement cooling optimization, renewable energy integration, and carbon tracking.",
        completed: false,
        tech: "Sarah Kim"
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
        
        // Truncate tables instead of deleting to reset sequences
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