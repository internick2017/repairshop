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

            {/* Search Bar and Live Update Controls */}
            <div className="flex items-center gap-4">
                <div className="max-w-md flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Search customers by name, email, phone, or address..."
                            value={pagination.search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10 pr-10"
                        />
                        {pagination.search && (
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

                {/* Live Update Indicator and Controls */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refetch}
                        disabled={loading}
                        className="gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Updating...' : 'Refresh'}
                    </Button>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {isPolling && (
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Live
                            </div>
                        )}
                        {lastUpdated && (
                            <div className="text-xs">
                                Updated: {lastUpdated.toLocaleTimeString()}
                            </div>
                        )}
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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {pagination.search ? "Filtered" : "Total"} Customers
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {pagination.search ? filteredCustomers.length : customers.length}
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