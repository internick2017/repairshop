"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { customers } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { CustomerTable } from "./CustomerTable";
import { Button } from "@/components/ui/button";
import { Plus, Users, CheckCircle, XCircle, Search, X, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePollingWithLocalStorage } from "@/hooks/usePolling";
import { usePaginatedData } from "@/hooks/useUrlPagination";
import { UrlPagination } from "@/components/pagination/UrlPagination";
import { fetchCustomers } from "@/lib/api/customers";
import Link from "next/link";

type Customer = InferSelectModel<typeof customers>;

interface CustomersPageClientProps {
    customers: Customer[];
    selectMode: boolean;
}

export function CustomersPageClient({ customers: initialCustomers, selectMode }: CustomersPageClientProps) {
    // Use polling for live updates
    const {
        data: liveCustomers,
        loading,
        error,
        lastUpdated,
        refetch,
        isPolling
    } = usePollingWithLocalStorage<Customer[]>(
        'customers-cache',
        fetchCustomers,
        {
            interval: 30000, // 30 seconds
            enabled: true,
            immediate: false, // Don't fetch immediately since we have initial data
            onError: (error) => {
                console.error('Customer polling error:', error);
            }
        }
    );

    // Use live data if available, fallback to initial data
    const customers = liveCustomers || initialCustomers;

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

    // URL-based pagination with search integration
    const pagination = usePaginatedData(customers, {
        defaultPageSize: 10,
        maxPageSize: 100,
        showPageRange: 5
    });

    // Sync search from URL with local filtering
    useEffect(() => {
        // Update search when URL changes
        if (pagination.search !== '') {
            // Search is handled by pagination hook
        }
    }, [pagination.search]);

    // Handle search input changes
    const handleSearchChange = useCallback((value: string) => {
        pagination.setSearch(value);
    }, [pagination]);

    const handleClearSearch = useCallback(() => {
        pagination.setSearch('');
    }, [pagination]);

    // Memoized filtered customers based on search query from URL
    const filteredCustomers = useMemo(() => {
        if (!pagination.search.trim()) {
            return customers;
        }

        const query = pagination.search.toLowerCase().trim();
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
    }, [customers, pagination.search, searchFields]);

    // Update pagination with filtered data
    const paginatedData = usePaginatedData(filteredCustomers, {
        defaultPageSize: pagination.pageSize,
        maxPageSize: 100,
        showPageRange: 5
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        {selectMode ? "Select Customer" : "Customers"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                        {selectMode 
                            ? "Choose a customer to create a new repair ticket" 
                            : "Manage your customer database"
                        }
                    </p>
                </div>
                
                {!selectMode && (
                    <Link href="/customers/form">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                            <Plus className="w-5 h-5 mr-2" />
                            Add Customer
                        </Button>
                    </Link>
                )}
            </div>

            {/* Search Bar and Live Update Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full sm:max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search customers by name, email, phone, or address..."
                                value={pagination.search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-12 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
                            />
                            {pagination.search && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearSearch}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Live Update Indicator and Controls */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="default"
                            onClick={refetch}
                            disabled={loading}
                            className="gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Updating...' : 'Refresh'}
                        </Button>
                        
                        <div className="flex flex-col items-end">
                            {isPolling && (
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-green-600 dark:text-green-400 font-medium">Live</span>
                                </div>
                            )}
                            {lastUpdated && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Updated: {lastUpdated.toLocaleTimeString()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-300">
                    <strong>Update failed:</strong> {error.message}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900/20 p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {pagination.search ? "Filtered" : "Total"} Customers
                            </p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                                {pagination.search ? filteredCustomers.length : customers.length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-800 rounded-xl shadow-lg border border-green-100 dark:border-green-900/20 p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                                {filteredCustomers.filter(c => c.active).length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-gray-800 rounded-xl shadow-lg border border-red-100 dark:border-red-900/20 p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                            <XCircle className="w-7 h-7 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                                {filteredCustomers.filter(c => !c.active).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Table */}
            {paginatedData.data.length > 0 && (
                <CustomerTable 
                    customers={paginatedData.data} 
                    selectMode={selectMode}
                />
            )}

            {/* Pagination */}
            {filteredCustomers.length > 0 && (
                <UrlPagination
                    page={paginatedData.page}
                    pageSize={paginatedData.pageSize}
                    totalItems={paginatedData.totalItems}
                    totalPages={paginatedData.totalPages}
                    hasNextPage={paginatedData.hasNextPage}
                    hasPrevPage={paginatedData.hasPrevPage}
                    onPageChange={paginatedData.setPage}
                    onPageSizeChange={paginatedData.setPageSize}
                    getPageRange={paginatedData.getPageRange}
                    className="mt-6"
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