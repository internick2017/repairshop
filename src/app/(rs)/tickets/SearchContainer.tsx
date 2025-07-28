"use client";

import { useState, useCallback } from "react";
import { SearchForm } from "./SearchForm";
import { SearchResults } from "./SearchResults";
import { SearchTicket } from "@/types";

interface SearchContainerProps {
  className?: string;
  onSearchStateChange?: (isSearching: boolean) => void;
}

export function SearchContainer({ className, onSearchStateChange }: SearchContainerProps = {}) {
  const [searchResults, setSearchResults] = useState<SearchTicket[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = useCallback((results: SearchTicket[], query: string = '') => {
    setSearchResults(results);
    // We're searching if we have an active query
    const searching = query.trim().length > 0;
    setIsSearching(searching);
    onSearchStateChange?.(searching);
  }, [onSearchStateChange]);

  const handleClearSearch = useCallback(() => {
    setSearchResults([]);
    setIsSearching(false);
    onSearchStateChange?.(false);
  }, [onSearchStateChange]);

  return (
    <div className={className}>
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