"use client";

import { Button } from "@/components/ui/button";
import { Calendar, User, FileText, Wrench } from "lucide-react";
import Link from "next/link";
import { SearchTicket } from "@/types";

interface SearchResultsProps {
  results: SearchTicket[];
  className?: string;
}



export function SearchResults({ results, className }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Search Results ({results.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {results.map((ticket) => (
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
                        {ticket.customerFirstName} {ticket.customerLastName}
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
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/tickets/form?ticketId=${ticket.id}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 