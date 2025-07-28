"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, CheckCircle, Clock, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TicketTable } from "./TicketTable";
import { Ticket } from "@/types";

interface TicketsPageClientProps {
  ticketsList: Ticket[];
  isManager: boolean;
}

export function TicketsPageClient({ ticketsList, isManager }: TicketsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Define searchable fields for tickets
  const searchFields = [
    'id',
    'title',
    'description',
    'tech'
  ];

  // Memoized filtered tickets based on search query
  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) {
      return ticketsList;
    }

    const query = searchQuery.toLowerCase().trim();
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
  }, [ticketsList, searchQuery, searchFields]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

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

      {/* Search Bar */}
      <div className="max-w-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search tickets by ID, title, tech, or description..."
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
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {searchQuery ? "Filtered" : (isManager ? "Total" : "My")} Tickets
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {searchQuery ? filteredTickets.length : ticketsList.length}
              </p>
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
                {filteredTickets.filter(t => !t.completed).length}
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
                {filteredTickets.filter(t => t.completed).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      {filteredTickets.length > 0 && (
        <TicketTable tickets={filteredTickets} />
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