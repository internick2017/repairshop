"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, CheckCircle, Clock, Search, X, RefreshCw, Hash, User, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePollingWithLocalStorage } from "@/hooks/usePolling";
import { usePaginatedData } from "@/hooks/useUrlPagination";
import { UrlPagination } from "@/components/pagination/UrlPagination";
import { fetchTickets } from "@/lib/api/tickets";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TicketTable } from "./TicketTable";
import { Ticket } from "@/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

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

  // Local search state
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // URL-based pagination with search integration
  const pagination = usePaginatedData(ticketsList, {
    defaultPageSize: 10,
    maxPageSize: 100,
    showPageRange: 5
  });

  // Update pagination search when debounced value changes
  useEffect(() => {
    if (debouncedSearchValue !== pagination.search) {
      pagination.setSearch(debouncedSearchValue);
    }
  }, [debouncedSearchValue, pagination]);

  // Handle search input changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    setSelectedSuggestionIndex(-1); // Reset selection when typing
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    pagination.setSearch('');
    setSelectedSuggestionIndex(-1);
    searchInputRef.current?.focus();
  }, [pagination]);

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchValue || searchValue.length < 2) return [];
    
    const suggestions = [];
    const query = searchValue.toLowerCase();
    
    // Ticket ID suggestions
    const ticketIds = ticketsList
      .filter(t => t.id.toString().includes(query))
      .slice(0, 3)
      .map(t => ({ type: 'id', value: `#${t.id}`, label: `Ticket #${t.id}`, icon: Hash }));
    
    // Technician suggestions
    const techs = ticketsList
      .filter(t => t.tech.toLowerCase().includes(query) && t.tech !== 'unassigned')
      .map(t => t.tech)
      .filter((tech, index, arr) => arr.indexOf(tech) === index)
      .slice(0, 3)
      .map(tech => ({ type: 'tech', value: tech, label: `Technician: ${tech}`, icon: Wrench }));
    
    // Customer suggestions
    const customers = ticketsList
      .filter(t => t.customer && (
        t.customer.firstName.toLowerCase().includes(query) ||
        t.customer.lastName.toLowerCase().includes(query) ||
        t.customer.email.toLowerCase().includes(query)
      ))
      .map(t => t.customer!)
      .filter((customer, index, arr) => 
        arr.findIndex(c => c.id === customer.id) === index
      )
      .slice(0, 3)
      .map(customer => ({ 
        type: 'customer', 
        value: `${customer.firstName} ${customer.lastName}`, 
        label: `Customer: ${customer.firstName} ${customer.lastName}`, 
        icon: User 
      }));
    
    return [...ticketIds, ...techs, ...customers].slice(0, 5);
  }, [searchValue, ticketsList]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: any) => {
    setSearchValue(suggestion.value);
    pagination.setSearch(suggestion.value);
    setSelectedSuggestionIndex(-1);
    searchInputRef.current?.focus();
  }, [pagination]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (searchSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : searchSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(searchSuggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setSelectedSuggestionIndex(-1);
        break;
    }
  }, [searchSuggestions, selectedSuggestionIndex, handleSuggestionClick]);

  // Memoized filtered tickets based on search query
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
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Repair Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Manage and track repair tickets for your customers
          </p>
        </div>
        
        <Link href="/tickets/form">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            <Plus className="w-5 h-5 mr-2" />
            New Ticket
          </Button>
        </Link>
      </div>

      {/* Search Bar and Live Update Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full sm:max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search tickets by ID, title, description, technician, or customer..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              
              {/* Search Suggestions */}
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.value}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors ${
                        index === selectedSuggestionIndex 
                          ? 'bg-blue-50 dark:bg-blue-900/20' 
                          : ''
                      } ${index === 0 ? 'rounded-t-lg' : ''} ${
                        index === searchSuggestions.length - 1 ? 'rounded-b-lg' : ''
                      }`}
                    >
                      <suggestion.icon className="w-4 h-4 text-gray-500" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {suggestion.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {suggestion.type}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
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
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {pagination.search ? "Filtered" : "Total"} Tickets
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {pagination.search ? filteredTickets.length : ticketsList.length}
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
        
        <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-800 rounded-xl shadow-lg border border-orange-100 dark:border-orange-900/20 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {filteredTickets.filter(t => !t.completed).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      {paginatedData.data.length > 0 && (
        <TicketTable 
          tickets={paginatedData.data} 
          isManager={isManager}
        />
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
              ? "No tickets found" 
              : "No tickets match your search"
            }
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {ticketsList.length === 0 
              ? "Get started by creating your first repair ticket."
              : "Try adjusting your search terms to find what you're looking for."
            }
          </p>
          {ticketsList.length === 0 && (
            <Link href="/tickets/form">
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