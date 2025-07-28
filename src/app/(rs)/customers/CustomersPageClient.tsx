"use client";

import { useState, useCallback, useMemo } from "react";
import { customers } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { CustomerTable } from "./CustomerTable";
import { Button } from "@/components/ui/button";
import { Plus, Users, CheckCircle, XCircle, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type Customer = InferSelectModel<typeof customers>;

interface CustomersPageClientProps {
    customers: Customer[];
    selectMode: boolean;
}

export function CustomersPageClient({ customers, selectMode }: CustomersPageClientProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Define searchable fields for customers
    const searchFields = [
        'firstName',
        'lastName',
        'email', 
        'phone',
        'address1',
        'city',
        'state',
        'zip'
    ];

    // Memoized filtered customers based on search query
    const filteredCustomers = useMemo(() => {
        if (!searchQuery.trim()) {
            return customers;
        }

        const query = searchQuery.toLowerCase().trim();
        return customers.filter(customer => {
            return searchFields.some(field => {
                const value = customer[field as keyof Customer];
                if (value == null) return false;
                
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(query);
                }
                if (typeof value === 'number') {
                    return value.toString().includes(query);
                }
                if (typeof value === 'boolean') {
                    return value.toString().toLowerCase().includes(query);
                }
                
                return false;
            });
        });
    }, [customers, searchQuery, searchFields]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {selectMode ? "Select Customer" : "Customers"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {selectMode 
                            ? "Choose a customer to create a new repair ticket" 
                            : "Manage your customer database"
                        }
                    </p>
                </div>
                
                {!selectMode && (
                    <Link href="/customers/form">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Customer
                        </Button>
                    </Link>
                )}
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search customers by name, email, phone, or address..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 pr-10"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearSearch}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {searchQuery ? "Filtered" : "Total"} Customers
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {searchQuery ? filteredCustomers.length : customers.length}
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
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {filteredCustomers.filter(c => c.active).length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {filteredCustomers.filter(c => !c.active).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Table */}
            {filteredCustomers.length > 0 && (
                <CustomerTable 
                    customers={filteredCustomers} 
                    selectMode={selectMode}
                />
            )}

            {/* Empty State */}
            {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {customers.length === 0 
                            ? "No customers found" 
                            : "No customers match your search"
                        }
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {customers.length === 0 
                            ? "Get started by adding your first customer."
                            : "Try adjusting your search terms to find what you're looking for."
                        }
                    </p>
                    {customers.length === 0 && !selectMode && (
                        <Link href="/customers/form">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Customer
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
} 