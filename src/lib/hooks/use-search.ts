import { useState, useCallback, useEffect, useMemo } from "react";
import { useDebounce } from "./use-debounce";
import { useSafeAction } from "./use-safe-action";
import { useSearchAnalytics } from "./use-search-analytics";
import { toast } from "sonner";

interface UseSearchOptions<T> {
  searchAction: (params: { query: string }) => Promise<{ data?: T[]; serverError?: unknown }>;
  debounceMs?: number;
  cacheKey?: string;
  onSuccess?: (results: T[], query: string) => void;
  onError?: (error: unknown) => void;
  emptyMessage?: string;
  errorMessage?: string;
  analyticsType?: string;
  userId?: string;
}

interface UseSearchReturn<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: T[];
  isSearching: boolean;
  isActive: boolean;
  handleClear: () => void;
  handleSubmit: (e?: React.FormEvent) => void;
  debouncedQuery: string;
}

// Simple in-memory cache for search results
const searchCache = new Map<string, { data: unknown[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useSearch<T>({
  searchAction,
  debounceMs = 500,
  cacheKey = "default",
  onSuccess,
  onError,
  emptyMessage = "No results found matching your search.",
  errorMessage = "Failed to search",
  analyticsType = "search",
  userId,
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, debounceMs);
  const { trackSearchStart, trackSearchComplete } = useSearchAnalytics();

  // Check if search is active
  const isActive = useMemo(() => searchQuery.trim().length > 0, [searchQuery]);

  // Get cache key for current query
  const getCacheKey = useCallback((query: string) => `${cacheKey}:${query}`, [cacheKey]);

  // Check cache for results
  const checkCache = useCallback((query: string): T[] | null => {
    const cached = searchCache.get(getCacheKey(query));
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T[];
    }
    return null;
  }, [getCacheKey]);

  // Update cache with new results
  const updateCache = useCallback((query: string, data: T[]) => {
    searchCache.set(getCacheKey(query), {
      data,
      timestamp: Date.now(),
    });
  }, [getCacheKey]);

  // Safe action for search
  const { execute } = useSafeAction(searchAction, {
    onSuccess: (data) => {
      // Handle both array results and paginated results
      const results = Array.isArray(data) ? data : (data as any).data || [];
      setSearchResults(results);
      updateCache(searchQuery, results);
      
      // Track analytics
      trackSearchComplete(searchQuery, results.length, analyticsType, userId);
      
      if (results.length === 0 && searchQuery.trim()) {
        toast.info(emptyMessage);
      }
      
      onSuccess?.(results, searchQuery);
      setIsSearching(false);
    },
    onError: (error) => {
      toast.error(error || errorMessage);
      onError?.(error);
      setIsSearching(false);
    },
  });

  // Handle search execution
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Check cache first
    const cached = checkCache(query);
    if (cached) {
      setSearchResults(cached);
      onSuccess?.(cached, query);
      return;
    }

    // Track search start and perform search
    trackSearchStart(query, analyticsType);
    setIsSearching(true);
    execute({ query });
  }, [checkCache, execute, onSuccess]);

  // Auto-search when debounced value changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else if (!debouncedQuery) {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [debouncedQuery, performSearch]);

  // Handle manual form submission
  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim() && searchQuery !== debouncedQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery, debouncedQuery, performSearch]);

  // Handle clearing search
  const handleClear = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    onSuccess?.([], '');
  }, [onSuccess]);

  // Clean up old cache entries periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      searchCache.forEach((value, key) => {
        if (now - value.timestamp > CACHE_TTL) {
          searchCache.delete(key);
        }
      });
    }, CACHE_TTL);

    return () => clearInterval(cleanup);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    isActive,
    handleClear,
    handleSubmit,
    debouncedQuery,
  };
}