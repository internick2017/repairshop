"use client";

import { useState, useEffect } from "react";
import { SearchForm } from "./SearchForm";
import { SearchResults } from "./SearchResults";
import { SearchTicket } from "@/types";

interface SearchContainerProps {
  className?: string;
}

export function SearchContainer({ className }: SearchContainerProps = {}) {
  const [searchResults, setSearchResults] = useState<SearchTicket[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = (results: SearchTicket[]) => {
    setSearchResults(results);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  // Hide/show main tickets list based on search state
  useEffect(() => {
    const ticketsList = document.getElementById('tickets-list');
    const statsSection = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
    const emptyState = document.querySelector('.text-center.py-12');
    
    if (ticketsList && statsSection) {
      if (isSearching) {
        ticketsList.style.display = 'none';
        statsSection.style.display = 'none';
        if (emptyState) {
          emptyState.style.display = 'none';
        }
      } else {
        ticketsList.style.display = 'block';
        statsSection.style.display = 'grid';
        if (emptyState) {
          emptyState.style.display = 'block';
        }
      }
    }
  }, [isSearching]);

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