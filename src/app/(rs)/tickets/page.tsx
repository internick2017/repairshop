import { Metadata } from "next";
import { getAllTickets } from "@/lib/queries/getAllTickets";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { TicketsPageClient } from "./TicketsPageClient";

export const metadata: Metadata = {
  title: 'Tickets',
}

export default async function TicketsPage() {
    try {
        // Get user session and permissions
        const { getUser, getPermission } = getKindeServerSession();
        const [managerPermission, user] = await Promise.all([
            getPermission("manager"),
            getUser()
        ]);

        const isManager = managerPermission?.isGranted || false;
        
        const allTickets = await getAllTickets();
        
        // Filter tickets based on user permissions
        const ticketsList = isManager 
            ? allTickets // Managers see all tickets
            : allTickets.filter(ticket => ticket.tech === user?.email); // Regular employees see only their tickets

        return <TicketsPageClient ticketsList={ticketsList} isManager={isManager} />;
    } catch (error) {
        Sentry.captureException(error, {
            tags: { component: 'TicketsPage', action: 'load_tickets' }
        });

        console.error('Tickets Page Error:', error);

        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                        Error Loading Tickets
                    </h2>
                    <p className="text-red-700 dark:text-red-300">
                        Failed to load tickets. Please try again later.
                    </p>
                </div>
            </div>
        );
    }
}