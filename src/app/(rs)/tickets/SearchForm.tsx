"use client";

import { SearchForm as GenericSearchForm } from "@/components/forms";
import { searchTicketsAction } from "@/lib/actions/search-actions";
import { SearchTicket } from "@/types";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearchResults: (results: SearchTicket[]) => void;
  placeholder?: string;
  className?: string;
}

export function SearchForm({ 
  onSearchResults, 
  placeholder = "Search tickets by title, description, or customer...",
  className 
}: SearchFormProps) {
  return (
    <GenericSearchForm<SearchTicket>
      onSearchResults={onSearchResults}
      searchAction={searchTicketsAction}
      placeholder={placeholder}
      title="Search Tickets"
      className={className}
      emptyMessage="No tickets found matching your search."
      errorMessage="Failed to search tickets"
      icon={<Search className="h-5 w-5" />}
    />
  );
} 