"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchButton } from "@/components/SearchButton";
import { Search } from "lucide-react";
import { searchCustomersAction } from "@/lib/actions/search-actions";
import { useSafeAction } from "@/lib/hooks/use-safe-action";
import { toast } from "sonner";

interface SearchFormProps {
  onSearchResults: (results: any[]) => void;
  placeholder?: string;
  className?: string;
}

export function SearchForm({ 
  onSearchResults, 
  placeholder = "Search customers by name, email, or phone...",
  className 
}: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { execute, isLoading } = useSafeAction(searchCustomersAction, {
    onSuccess: (data: any) => {
      onSearchResults(data.data || []);
      if (data.data?.length === 0) {
        toast.info("No customers found matching your search.");
      }
    },
    onError: (error) => {
      toast.error(error || "Failed to search customers");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      execute({ query: searchQuery });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Customers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="sr-only">
              Search customers
            </Label>
            <Input
              id="search"
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <SearchButton 
            className="w-full sm:w-auto"
          >
            Search Customers
          </SearchButton>
        </form>
      </CardContent>
    </Card>
  );
} 