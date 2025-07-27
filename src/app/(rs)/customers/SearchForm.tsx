"use client";

import { SearchForm as GenericSearchForm } from "@/components/forms";
import { searchCustomersAction } from "@/lib/actions/search-actions";
import { Customer } from "@/types";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearchResults: (results: Customer[]) => void;
  placeholder?: string;
  className?: string;
}

export function SearchForm({ 
  onSearchResults, 
  placeholder = "Search customers by name, email, or phone...",
  className 
}: SearchFormProps) {
  return (
    <GenericSearchForm<Customer>
      onSearchResults={onSearchResults}
      searchAction={searchCustomersAction}
      placeholder={placeholder}
      title="Search Customers"
      className={className}
      emptyMessage="No customers found matching your search."
      errorMessage="Failed to search customers"
      icon={<Search className="h-5 w-5" />}
    />
  );
} 