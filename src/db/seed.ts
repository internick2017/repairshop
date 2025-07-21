import { seedDatabase, clearDatabase } from './seed-data';

async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--clear')) {
        await clearDatabase();
    } else {
        await seedDatabase();
    }
    
    process.exit(0);
}

main().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
}); 