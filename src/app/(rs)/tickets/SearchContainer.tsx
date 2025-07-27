"use client";

import { useState } from "react";
import { SearchForm } from "./SearchForm";
import { SearchResults } from "./SearchResults";

interface Ticket {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  tech: string;
  createdAt: Date;
  updatedAt: Date;
  customerId: number;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
}

export function SearchContainer() {
  const [searchResults, setSearchResults] = useState<Ticket[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = (results: Ticket[]) => {
    setSearchResults(results);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="mb-8">
      <SearchForm 
        onSearchResults={handleSearchResults}
        className="mb-6"
      />
      
      {isSearching && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {searchResults.length > 0 ? "Search Results" : "No Results Found"}
            </h3>
            <button
              onClick={handleClearSearch}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear Search
            </button>
          </div>
          <SearchResults results={searchResults} />
        </div>
      )}
    </div>
  );
} 