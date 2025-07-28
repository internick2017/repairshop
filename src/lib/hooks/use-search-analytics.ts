import { useCallback } from "react";

interface SearchAnalyticsEvent {
  query: string;
  resultCount: number;
  timestamp: number;
  duration?: number;
  searchType: string;
  userId?: string;
}

// In a real app, this would send to an analytics service
class SearchAnalytics {
  private events: SearchAnalyticsEvent[] = [];
  private searchStartTime: Map<string, number> = new Map();

  startSearch(query: string, searchType: string) {
    this.searchStartTime.set(`${searchType}:${query}`, Date.now());
  }

  trackSearch(query: string, resultCount: number, searchType: string, userId?: string) {
    const key = `${searchType}:${query}`;
    const startTime = this.searchStartTime.get(key);
    const duration = startTime ? Date.now() - startTime : undefined;
    
    const event: SearchAnalyticsEvent = {
      query,
      resultCount,
      timestamp: Date.now(),
      duration,
      searchType,
      userId,
    };

    this.events.push(event);
    this.searchStartTime.delete(key);

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(event);
    } else {
      console.log('Search Analytics:', event);
    }
  }

  trackEmptySearch(query: string, searchType: string, userId?: string) {
    this.trackSearch(query, 0, searchType, userId);
  }

  getPopularSearches(limit: number = 10): { query: string; count: number }[] {
    const searchCounts = new Map<string, number>();
    
    this.events.forEach(event => {
      const count = searchCounts.get(event.query) || 0;
      searchCounts.set(event.query, count + 1);
    });

    return Array.from(searchCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getAverageSearchTime(): number {
    const eventsWithDuration = this.events.filter(e => e.duration !== undefined);
    if (eventsWithDuration.length === 0) return 0;
    
    const totalDuration = eventsWithDuration.reduce((sum, e) => sum + e.duration!, 0);
    return totalDuration / eventsWithDuration.length;
  }

  private async sendToAnalytics(event: SearchAnalyticsEvent) {
    // Implement actual analytics service integration
    // Example: Google Analytics, Mixpanel, Amplitude, etc.
    try {
      // await fetch('/api/analytics/search', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event),
      // });
    } catch (error) {
      console.error('Failed to send search analytics:', error);
    }
  }
}

// Singleton instance
const analytics = new SearchAnalytics();

export function useSearchAnalytics() {
  const trackSearchStart = useCallback((query: string, searchType: string) => {
    analytics.startSearch(query, searchType);
  }, []);

  const trackSearchComplete = useCallback(
    (query: string, resultCount: number, searchType: string, userId?: string) => {
      analytics.trackSearch(query, resultCount, searchType, userId);
    },
    []
  );

  const trackEmptySearch = useCallback(
    (query: string, searchType: string, userId?: string) => {
      analytics.trackEmptySearch(query, searchType, userId);
    },
    []
  );

  const getPopularSearches = useCallback((limit?: number) => {
    return analytics.getPopularSearches(limit);
  }, []);

  const getAverageSearchTime = useCallback(() => {
    return analytics.getAverageSearchTime();
  }, []);

  return {
    trackSearchStart,
    trackSearchComplete,
    trackEmptySearch,
    getPopularSearches,
    getAverageSearchTime,
  };
}