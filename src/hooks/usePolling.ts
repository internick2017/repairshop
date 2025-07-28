"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface UsePollingOptions {
  interval?: number; // in milliseconds
  enabled?: boolean;
  immediate?: boolean; // Execute immediately on mount
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
}

interface UsePollingReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
  start: () => void;
  stop: () => void;
  isPolling: boolean;
}

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: UsePollingOptions = {}
): UsePollingReturn<T> {
  const {
    interval = 30000, // 30 seconds default
    enabled = true,
    immediate = true,
    onError,
    retryCount = 3,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(enabled);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const executeRequest = useCallback(async (isRetry = false) => {
    if (!mountedRef.current) return;

    if (!isRetry) {
      setLoading(true);
      setError(null);
    }

    try {
      const result = await fetchFn();
      
      if (!mountedRef.current) return;

      setData(result);
      setLastUpdated(new Date());
      setError(null);
      retryCountRef.current = 0; // Reset retry count on success
      
      if (!isRetry) {
        setLoading(false);
      }
    } catch (err) {
      if (!mountedRef.current) return;

      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      
      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        retryTimeoutRef.current = setTimeout(() => {
          executeRequest(true);
        }, retryDelay * retryCountRef.current); // Exponential backoff
        return;
      }

      setError(error);
      if (!isRetry) {
        setLoading(false);
      }
      
      if (onError) {
        onError(error);
      }
    }
  }, [fetchFn, onError, retryCount, retryDelay]);

  const start = useCallback(() => {
    if (!mountedRef.current) return;
    
    setIsPolling(true);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Execute immediately if requested
    if (immediate && data === null) {
      executeRequest();
    }

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      executeRequest();
    }, interval);
  }, [executeRequest, immediate, interval, data]);

  const stop = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const refetch = useCallback(async () => {
    await executeRequest();
  }, [executeRequest]);

  // Handle enabled state changes
  useEffect(() => {
    if (enabled && !isPolling) {
      start();
    } else if (!enabled && isPolling) {
      stop();
    }
  }, [enabled, isPolling, start, stop]);

  // Handle visibility change (pause when tab is not visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else if (enabled) {
        start();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, start, stop]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch,
    start,
    stop,
    isPolling
  };
}

// Specialized hooks for common use cases
export function usePollingWithLocalStorage<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UsePollingOptions = {}
): UsePollingReturn<T> {
  const [initialData, setInitialData] = useState<T | null>(null);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setInitialData(JSON.parse(stored));
      }
    } catch (error) {
      console.warn(`Failed to load data from localStorage key "${key}":`, error);
    }
  }, [key]);

  const polling = usePolling(fetchFn, {
    ...options,
    immediate: initialData === null
  });

  // Save to localStorage when data changes
  useEffect(() => {
    if (polling.data) {
      try {
        localStorage.setItem(key, JSON.stringify(polling.data));
      } catch (error) {
        console.warn(`Failed to save data to localStorage key "${key}":`, error);
      }
    }
  }, [key, polling.data]);

  return {
    ...polling,
    data: polling.data || initialData
  };
}