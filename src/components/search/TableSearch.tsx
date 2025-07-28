"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableSearchProps {
  onSearchChange: (filteredData: any[]) => void;
  data: any[];
  searchFields: string[];
  placeholder?: string;
  className?: string;
}

export function TableSearch({ 
  onSearchChange, 
  data, 
  searchFields, 
  placeholder = "Search...",
  className 
}: TableSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const onSearchChangeRef = useRef(onSearchChange);

  // Update the ref when the callback changes but only when it actually changes
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  });

  // Memoize filtered data to prevent infinite re-renders
  const filteredData = useMemo(() => {
    if (searchQuery.trim() === "") {
      return data;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return data.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value == null) return false;
        
        // Handle different data types
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        }
        if (typeof value === 'number') {
          return value.toString().includes(query);
        }
        if (typeof value === 'boolean') {
          return value.toString().toLowerCase().includes(query);
        }
        if (value instanceof Date) {
          return value.toLocaleDateString().toLowerCase().includes(query);
        }
        
        return false;
      });
    });
  }, [data, searchFields, searchQuery]);

  // Update parent when filtered data changes
  useEffect(() => {
    onSearchChangeRef.current(filteredData);
  }, [filteredData]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
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
  );
} 