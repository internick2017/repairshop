import { useCallback, useRef } from 'react';

interface SearchAnalytics {
  query: string;
  resultsCount: number;
  searchTime: number;
  timestamp: Date;
  searchType: 'instant' | 'debounced' | 'suggestion';
}

interface UseSearchAnalyticsOptions {
  onSearchComplete?: (analytics: SearchAnalytics) => void;
  enableTracking?: boolean;
}

export function useSearchAnalytics(options: UseSearchAnalyticsOptions = {}) {
  const { onSearchComplete, enableTracking = true } = options;
  const searchStartTime = useRef<number | null>(null);
  const lastQuery = useRef<string>('');

  const startSearch = useCallback((query: string) => {
    if (!enableTracking) return;
    
    searchStartTime.current = performance.now();
    lastQuery.current = query;
  }, [enableTracking]);

  const completeSearch = useCallback((
    query: string, 
    resultsCount: number, 
    searchType: SearchAnalytics['searchType'] = 'instant'
  ) => {
    if (!enableTracking || !searchStartTime.current) return;

    const searchTime = performance.now() - searchStartTime.current;
    const analytics: SearchAnalytics = {
      query,
      resultsCount,
      searchTime,
      timestamp: new Date(),
      searchType
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Search Analytics:', {
        query,
        resultsCount,
        searchTime: `${searchTime.toFixed(2)}ms`,
        searchType
      });
    }

    // Call callback if provided
    onSearchComplete?.(analytics);

    // Reset timer
    searchStartTime.current = null;
  }, [enableTracking, onSearchComplete]);

  const trackSuggestionClick = useCallback((suggestion: string, originalQuery: string) => {
    if (!enableTracking) return;

    const analytics: SearchAnalytics = {
      query: suggestion,
      resultsCount: 0, // Will be updated when search completes
      searchTime: 0,
      timestamp: new Date(),
      searchType: 'suggestion'
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('💡 Suggestion Clicked:', {
        originalQuery,
        selectedSuggestion: suggestion
      });
    }

    onSearchComplete?.(analytics);
  }, [enableTracking, onSearchComplete]);

  return {
    startSearch,
    completeSearch,
    trackSuggestionClick
  };
}