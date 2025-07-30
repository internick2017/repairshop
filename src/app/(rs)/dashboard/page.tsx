import { Metadata } from "next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import { getAllTickets } from "@/lib/queries/getAllTickets";
import { getAllCustomers } from "@/lib/queries/getAllCustomers";
import * as Sentry from "@sentry/nextjs";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Computer Repair Shop Dashboard - Overview and Analytics',
}

export default async function DashboardPage() {
    try {
        // Get user session and permissions
        const { getUser, getPermission } = getKindeServerSession();
        const [managerPermission, user] = await Promise.all([
            getPermission("manager"),
            getUser()
        ]);

        const isManager = managerPermission?.isGranted || false;
        
        // Fetch data for dashboard
        const [allTickets, allCustomers] = await Promise.all([
            getAllTickets(),
            getAllCustomers()
        ]);
        
        // Filter tickets based on user permissions
        const ticketsList = isManager 
            ? allTickets // Managers see all tickets
            : allTickets.filter(ticket => ticket.tech === user?.email); // Regular employees see only their tickets

        // Calculate dashboard metrics
        const dashboardData = {
            totalTickets: ticketsList.length,
            openTickets: ticketsList.filter(t => !t.completed).length,
            completedTickets: ticketsList.filter(t => t.completed).length,
            totalCustomers: allCustomers.length,
            activeCustomers: allCustomers.filter(c => c.active).length,
            completionRate: ticketsList.length > 0 
                ? Math.round((ticketsList.filter(t => t.completed).length / ticketsList.length) * 100)
                : 0,
            recentTickets: ticketsList
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5),
            recentCustomers: allCustomers
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
        };

        return <DashboardClient dashboardData={dashboardData} isManager={isManager} />;
    } catch (error) {
        Sentry.captureException(error, {
            tags: { component: 'DashboardPage', action: 'load_dashboard' }
        });

        console.error('Dashboard Page Error:', error);

        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                        Error Loading Dashboard
                    </h2>
                    <p className="text-red-700 dark:text-red-300">
                        Failed to load dashboard data. Please try again later.
                    </p>
                </div>
            </div>
        );
    }
} 