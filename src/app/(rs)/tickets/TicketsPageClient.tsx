"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, CheckCircle, Clock, Search, X, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePollingWithLocalStorage } from "@/hooks/usePolling";
import { usePaginatedData } from "@/hooks/useUrlPagination";
import { UrlPagination } from "@/components/pagination/UrlPagination";
import { fetchTickets } from "@/lib/api/tickets";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TicketTable } from "./TicketTable";
import { Ticket } from "@/types";

interface TicketsPageClientProps {
  ticketsList: Ticket[];
  isManager: boolean;
}

export function TicketsPageClient({ ticketsList: initialTickets, isManager }: TicketsPageClientProps) {
  // Use polling for live updates
  const {
    data: liveTicketsData,
    loading,
    error,
    lastUpdated,
    refetch,
    isPolling
  } = usePollingWithLocalStorage<{ tickets: Ticket[] }>(
    'tickets-cache',
    fetchTickets,
    {
      interval: 30000, // 30 seconds
      enabled: true,
      immediate: false, // Don't fetch immediately since we have initial data
      onError: (error) => {
        console.error('Ticket polling error:', error);
      }
    }
  );

  // Use live data if available, fallback to initial data
  const ticketsList = liveTicketsData?.tickets || initialTickets;

  // Define searchable fields for tickets
  const searchFields = [
    'id',
    'title',
    'description',
    'tech'
  ];

  // URL-based pagination with search integration
  const pagination = usePaginatedData(ticketsList, {
    defaultPageSize: 10,
    maxPageSize: 100,
    showPageRange: 5
  });

  // Handle search input changes
  const handleSearchChange = useCallback((value: string) => {
    pagination.setSearch(value);
  }, [pagination]);

  const handleClearSearch = useCallback(() => {
    pagination.setSearch('');
  }, [pagination]);

  // Memoized filtered tickets based on search query from URL
  const filteredTickets = useMemo(() => {
    if (!pagination.search.trim()) {
      return ticketsList;
    }

    const query = pagination.search.toLowerCase().trim();
    return ticketsList.filter(ticket => {
      return searchFields.some(field => {
        const value = ticket[field as keyof Ticket];
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
  }, [ticketsList, pagination.search, searchFields]);

  // Update pagination with filtered data
  const paginatedData = usePaginatedData(filteredTickets, {
    defaultPageSize: pagination.pageSize,
    maxPageSize: 100,
    showPageRange: 5
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            {isManager ? "All Repair Tickets" : "My Tickets"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            {isManager 
              ? "Manage and track all repair tickets" 
              : "View and update your assigned tickets"
            }
          </p>
        </div>
        
        {isManager && (
          <Link href="/customers?select=true">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              New Ticket
            </Button>
          </Link>
        )}
      </div>

      {/* Search Bar and Live Update Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full sm:max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search tickets by ID, title, tech, or description..."
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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-300 mb-6">
          <strong>Update failed:</strong> {error.message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900/20 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {pagination.search ? "Filtered" : (isManager ? "Total" : "My")} Tickets
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {pagination.search ? filteredTickets.length : ticketsList.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-800 rounded-xl shadow-lg border border-yellow-100 dark:border-yellow-900/20 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {filteredTickets.filter(t => !t.completed).length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {filteredTickets.filter(t => t.completed).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      {paginatedData.data.length > 0 && (
        <TicketTable tickets={paginatedData.data} />
      )}

      {/* Pagination */}
      {filteredTickets.length > 0 && (
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
      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {ticketsList.length === 0 
              ? (isManager ? "No tickets found" : "No tickets assigned to you")
              : "No tickets match your search"
            }
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {ticketsList.length === 0 
              ? (isManager 
                  ? "Get started by creating your first repair ticket."
                  : "You don't have any tickets assigned to you yet."
                )
              : "Try adjusting your search terms to find what you're looking for."
            }
          </p>
          {isManager && ticketsList.length === 0 && (
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
}