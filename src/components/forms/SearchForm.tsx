"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchButton } from "@/components/SearchButton";
import { Search } from "lucide-react";
import { useSafeAction } from "@/lib/hooks/use-safe-action";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SearchFormProps<T> {
  onSearchResults: (results: T[], query?: string) => void;
  searchAction: (params: { query: string }) => Promise<{ data?: T[]; serverError?: unknown }>;
  placeholder?: string;
  title?: string;
  className?: string;
  emptyMessage?: string;
  errorMessage?: string;
  icon?: React.ReactNode;
}

export function SearchForm<T>({ 
  onSearchResults, 
  searchAction,
  placeholder = "Search...",
  title = "Search",
  className,
  emptyMessage = "No results found matching your search.",
  errorMessage = "Failed to search",
  icon = <Search className="h-5 w-5" />
}: SearchFormProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const safeActionOptions = useMemo(() => ({
    onSuccess: (data: any) => {
      onSearchResults(data.data || [], debouncedSearchQuery);
      if (data.data?.length === 0 && debouncedSearchQuery.trim()) {
        toast.info(emptyMessage);
      }
      setIsSearching(false);
    },
    onError: (error: any) => {
      toast.error(error || errorMessage);
      setIsSearching(false);
    },
  }), [onSearchResults, debouncedSearchQuery, emptyMessage, errorMessage]);

  const { execute } = useSafeAction(searchAction, safeActionOptions);

  // Auto-search when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      setIsSearching(true);
      execute({ query: debouncedSearchQuery });
    } else if (!debouncedSearchQuery) {
      onSearchResults([], '');
      setIsSearching(false);
    }
  }, [debouncedSearchQuery, execute, onSearchResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchQuery !== debouncedSearchQuery) {
      setIsSearching(true);
      execute({ query: searchQuery });
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearchResults([], '');
    setIsSearching(false);
  };

  return (
    <Card className={cn("w-full", className)}>
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
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <SearchButton 
              className="flex-1 sm:flex-initial"
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
  );
}