'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    FileText, 
    Users, 
    CheckCircle, 
    Clock, 
    TrendingUp, 
    Plus,
    ArrowRight,
    Calendar,
    UserPlus,
    Settings
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "@/lib/utils/date-utils";

interface DashboardData {
    totalTickets: number;
    openTickets: number;
    completedTickets: number;
    totalCustomers: number;
    activeCustomers: number;
    completionRate: number;
    recentTickets: any[];
    recentCustomers: any[];
}

interface DashboardClientProps {
    dashboardData: DashboardData;
    isManager: boolean;
}

export function DashboardClient({ dashboardData, isManager }: DashboardClientProps) {
    const {
        totalTickets,
        openTickets,
        completedTickets,
        totalCustomers,
        activeCustomers,
        completionRate,
        recentTickets,
        recentCustomers
    } = dashboardData;

    const stats = [
        {
            title: "Total Tickets",
            value: totalTickets,
            icon: FileText,
            color: "blue",
            description: "All tickets in system"
        },
        {
            title: "Open Tickets",
            value: openTickets,
            icon: Clock,
            color: "orange",
            description: "Tickets in progress"
        },
        {
            title: "Completed",
            value: completedTickets,
            icon: CheckCircle,
            color: "green",
            description: "Successfully completed"
        },
        {
            title: "Completion Rate",
            value: `${completionRate}%`,
            icon: TrendingUp,
            color: "purple",
            description: "Overall success rate"
        }
    ];

    const quickActions = [
        {
            title: "Create Ticket",
            description: "Add a new repair ticket",
            icon: Plus,
            href: "/tickets/form",
            color: "blue"
        },
        {
            title: "Add Customer",
            description: "Register a new customer",
            icon: UserPlus,
            href: "/customers/form",
            color: "green"
        },
        {
            title: "View All Tickets",
            description: "Browse all tickets",
            icon: FileText,
            href: "/tickets",
            color: "orange"
        },
        {
            title: "Customer List",
            description: "Manage customers",
            icon: Users,
            href: "/customers",
            color: "purple"
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: "from-blue-500 to-blue-600",
            green: "from-green-500 to-emerald-500",
            orange: "from-orange-500 to-red-500",
            purple: "from-purple-500 to-pink-500"
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Welcome back! Here's what's happening with your repair shop.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/settings">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {stat.title}
                            </CardTitle>
                            <div className={`w-10 h-10 bg-gradient-to-br ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center shadow-lg`}>
                                <stat.icon className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {stat.value}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                        <Link href={action.href}>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(action.color)} rounded-lg flex items-center justify-center shadow-lg`}>
                                        <action.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {action.description}
                                        </p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-gray-400" />
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Tickets */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="h-5 w-5" />
                            <span>Recent Tickets</span>
                        </CardTitle>
                        <CardDescription>
                            Latest tickets in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTickets.length > 0 ? (
                                recentTickets.map((ticket) => (
                                    <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                {ticket.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {ticket.tech} • {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <Badge variant={ticket.completed ? "default" : "secondary"}>
                                            {ticket.completed ? "Completed" : "Open"}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No tickets yet</p>
                                    <Button className="mt-4" asChild>
                                        <Link href="/tickets/form">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create First Ticket
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                        {recentTickets.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button variant="outline" size="sm" asChild className="w-full">
                                    <Link href="/tickets">
                                        View All Tickets
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Customers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>Recent Customers</span>
                        </CardTitle>
                        <CardDescription>
                            Newly registered customers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentCustomers.length > 0 ? (
                                recentCustomers.map((customer) => (
                                    <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                {customer.firstName} {customer.lastName}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {customer.email} • {formatDistanceToNow(new Date(customer.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <Badge variant={customer.active ? "default" : "secondary"}>
                                            {customer.active ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No customers yet</p>
                                    <Button className="mt-4" asChild>
                                        <Link href="/customers/form">
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Add First Customer
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                        {recentCustomers.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button variant="outline" size="sm" asChild className="w-full">
                                    <Link href="/customers">
                                        View All Customers
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats for Managers */}
            {isManager && (
                <Card>
                    <CardHeader>
                        <CardTitle>Business Overview</CardTitle>
                        <CardDescription>
                            Key metrics for business management
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {totalCustomers}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Customers
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {activeCustomers}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Active Customers
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {completionRate}%
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Completion Rate
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 