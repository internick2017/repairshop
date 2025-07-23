import { db } from "./index";
import { migrate } from "drizzle-orm/neon-http/migrator";

const main = async () => {
    try {
        console.log("Starting database migration...");
        await migrate(db, { migrationsFolder: "src/db/migrations" });
        console.log("Database migration completed successfully!");
    } catch (error) {
        console.error("Error migrating database:", error);
        if (error instanceof Error) {
            console.error("Error details:", {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
        }
        process.exit(1);
    }
}

main();