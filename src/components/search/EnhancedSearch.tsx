'use client'

import { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Search, 
    Filter, 
    X, 
    Clock, 
    CheckCircle, 
    User,
    FileText,
    Calendar,
    MapPin
} from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface SearchFilter {
    status?: 'all' | 'open' | 'completed';
    tech?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
    priority?: 'all' | 'low' | 'medium' | 'high';
}

interface EnhancedSearchProps {
    placeholder?: string;
    onSearch: (query: string, filters: SearchFilter) => void;
    onClear: () => void;
    loading?: boolean;
    searchType: 'tickets' | 'customers';
    className?: string;
}

export function EnhancedSearch({ 
    placeholder = "Search...", 
    onSearch, 
    onClear, 
    loading = false,
    searchType,
    className 
}: EnhancedSearchProps) {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilter>({});
    const [showFilters, setShowFilters] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    
    const debouncedQuery = useDebounce(query, 300);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`recent-searches-${searchType}`);
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (error) {
                console.error('Failed to parse recent searches:', error);
            }
        }
    }, [searchType]);

    // Save search to recent searches
    const saveSearch = useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) return;
        
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem(`recent-searches-${searchType}`, JSON.stringify(updated));
    }, [recentSearches, searchType]);

    // Handle search
    useEffect(() => {
        if (debouncedQuery || Object.keys(filters).length > 0) {
            onSearch(debouncedQuery, filters);
            if (debouncedQuery) {
                saveSearch(debouncedQuery);
            }
        }
    }, [debouncedQuery, filters, onSearch, saveSearch]);

    const handleClear = () => {
        setQuery('');
        setFilters({});
        onClear();
    };

    const handleFilterChange = (key: keyof SearchFilter, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const removeFilter = (key: keyof SearchFilter) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    };

    const getActiveFiltersCount = () => {
        return Object.keys(filters).filter(key => filters[key as keyof SearchFilter] !== undefined).length;
    };

    const getStatusOptions = () => {
        if (searchType === 'tickets') {
            return [
                { value: 'all', label: 'All Status', icon: FileText },
                { value: 'open', label: 'Open', icon: Clock },
                { value: 'completed', label: 'Completed', icon: CheckCircle }
            ];
        }
        return [
            { value: 'all', label: 'All Status', icon: User },
            { value: 'active', label: 'Active', icon: CheckCircle },
            { value: 'inactive', label: 'Inactive', icon: Clock }
        ];
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-20"
                    disabled={loading}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="h-8 w-8 p-0"
                    >
                        <Filter className="h-4 w-4" />
                        {getActiveFiltersCount() > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                                {getActiveFiltersCount()}
                            </Badge>
                        )}
                    </Button>
                    {query && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                        if (value === undefined) return null;
                        return (
                            <Badge key={key} variant="secondary" className="flex items-center space-x-1">
                                <span>{key}: {String(value)}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFilter(key as keyof SearchFilter)}
                                    className="h-4 w-4 p-0 hover:bg-transparent"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        );
                    })}
                </div>
            )}

            {/* Filters Panel */}
            {showFilters && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Search Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <div className="flex flex-wrap gap-2">
                                {getStatusOptions().map((option) => (
                                    <Button
                                        key={option.value}
                                        variant={filters.status === option.value ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleFilterChange('status', option.value)}
                                        className="flex items-center space-x-2"
                                    >
                                        <option.icon className="h-4 w-4" />
                                        <span>{option.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Technician Filter (for tickets) */}
                        {searchType === 'tickets' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Technician</label>
                                <Input
                                    placeholder="Filter by technician..."
                                    value={filters.tech || ''}
                                    onChange={(e) => handleFilterChange('tech', e.target.value || undefined)}
                                    className="max-w-xs"
                                />
                            </div>
                        )}

                        {/* Priority Filter (for tickets) */}
                        {searchType === 'tickets' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Priority</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { value: 'all', label: 'All', color: 'gray' },
                                        { value: 'low', label: 'Low', color: 'green' },
                                        { value: 'medium', label: 'Medium', color: 'yellow' },
                                        { value: 'high', label: 'High', color: 'red' }
                                    ].map((priority) => (
                                        <Button
                                            key={priority.value}
                                            variant={filters.priority === priority.value ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleFilterChange('priority', priority.value)}
                                        >
                                            {priority.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Clear Filters */}
                        {getActiveFiltersCount() > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => setFilters({})}
                                className="w-full"
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && !showFilters && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Recent Searches</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((search, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setQuery(search)}
                                    className="text-xs"
                                >
                                    {search}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search Analytics */}
            {query && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Searching for "{query}" with {getActiveFiltersCount()} active filter{getActiveFiltersCount() !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
} 