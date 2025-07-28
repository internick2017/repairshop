"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchButton } from "@/components/SearchButton";
import { Search, X } from "lucide-react";
import { useSearch } from "@/lib/hooks/use-search";
import { cn } from "@/lib/utils";

interface SearchContainerProps<T> {
  searchAction: (params: { query: string }) => Promise<{ data?: T[]; serverError?: unknown }>;
  renderResults: (results: T[]) => React.ReactNode;
  placeholder?: string;
  title?: string;
  className?: string;
  emptyMessage?: string;
  errorMessage?: string;
  icon?: React.ReactNode;
  cacheKey?: string;
  onSearchStateChange?: (isSearching: boolean) => void;
}

export function SearchContainer<T>({
  searchAction,
  renderResults,
  placeholder = "Search...",
  title = "Search",
  className,
  emptyMessage = "No results found matching your search.",
  errorMessage = "Failed to search",
  icon = <Search className="h-5 w-5" />,
  cacheKey = "search",
  onSearchStateChange,
}: SearchContainerProps<T>) {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    isActive,
    handleClear,
    handleSubmit,
  } = useSearch<T>({
    searchAction,
    debounceMs: 500,
    cacheKey,
    emptyMessage,
    errorMessage,
    onSuccess: (results, query) => {
      onSearchStateChange?.(query.trim().length > 0);
    },
  });

  // Update parent when search state changes
  React.useEffect(() => {
    onSearchStateChange?.(isActive);
  }, [isActive, onSearchStateChange]);

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="sr-only">
                {title}
              </Label>
              <div className="relative">
                <Input
                  id="search"
                  type="text"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <SearchButton 
                className="flex-1 sm:flex-initial"
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </SearchButton>
              {searchQuery && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="sm:w-auto"
                  disabled={isSearching}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {isActive && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {searchResults.length > 0 
                ? `Search Results (${searchResults.length})` 
                : isSearching 
                  ? "Searching..." 
                  : "No Results Found"
              }
            </h3>
            <button
              onClick={handleClear}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear Search
            </button>
          </div>
          {renderResults(searchResults)}
        </div>
      )}
    </div>
  );
}