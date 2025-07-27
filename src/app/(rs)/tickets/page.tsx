import { Metadata } from "next";
import { getAllTickets } from "@/lib/queries/getAllTickets";
import { Button } from "@/components/ui/button";
import { Plus, FileText, User, Calendar, Wrench, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { SearchContainer } from "./SearchContainer";
import { Breadcrumb } from "@/components/Breadcrumb";

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

        return (
            <div className="max-w-7xl mx-auto p-6">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-4" />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {isManager ? "All Repair Tickets" : "My Tickets"}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {isManager 
                                ? "Manage and track all repair tickets" 
                                : "View and update your assigned tickets"
                            }
                        </p>
                    </div>
                    
                    {isManager && (
                        <Link href="/customers?select=true">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                New Ticket
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Search Section */}
                <SearchContainer />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {isManager ? "Total Tickets" : "My Tickets"}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{ticketsList.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {ticketsList.filter(t => !t.completed).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {ticketsList.filter(t => t.completed).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tickets List - Hidden when searching */}
                <div id="tickets-list" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {isManager ? "Recent Tickets" : "My Recent Tickets"}
                        </h2>
                    </div>
                    
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {ticketsList.map((ticket) => (
                            <div key={ticket.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                #{ticket.id} - {ticket.title}
                                            </h3>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                ticket.completed 
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                            }`}>
                                                {ticket.completed ? "Completed" : "Pending"}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                            {ticket.description}
                                        </p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                                <User className="w-4 h-4" />
                                                <span>
                                                    {ticket.customer?.firstName} {ticket.customer?.lastName}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                                <Wrench className="w-4 h-4" />
                                                <span>{ticket.tech}</span>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="ml-6">
                                        <Link href={`/tickets/form?ticketId=${ticket.id}`}>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Empty State */}
                {ticketsList.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {isManager ? "No tickets found" : "No tickets assigned to you"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {isManager 
                                ? "Get started by creating your first repair ticket."
                                : "You don't have any tickets assigned to you yet."
                            }
                        </p>
                        {isManager && (
                            <Link href="/customers?select=true">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Ticket
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        );
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