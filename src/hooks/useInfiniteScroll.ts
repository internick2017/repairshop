"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 200,
  rootMargin = '0px'
}: UseInfiniteScrollProps) {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore && !loading && !loadingRef.current) {
      setIsFetching(true);
      loadingRef.current = true;
      
      onLoadMore();
      
      // Reset after a delay to prevent rapid firing
      setTimeout(() => {
        setIsFetching(false);
        loadingRef.current = false;
      }, 500);
    }
  }, [isFetching, hasMore, loading, onLoadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, threshold]);

  return { observerRef, isFetching };
}

// Hook for infinite scroll with data management
interface UseInfiniteDataProps<T> {
  fetchData: (page: number, pageSize?: number) => Promise<{
    data: T[];
    hasMore: boolean;
    total?: number;
  }>;
  pageSize?: number;
  enabled?: boolean;
}

interface InfiniteDataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  total?: number;
}

export function useInfiniteData<T>({
  fetchData,
  pageSize = 20,
  enabled = true
}: UseInfiniteDataProps<T>) {
  const [state, setState] = useState<InfiniteDataState<T>>({
    data: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 0,
    total: undefined,
  });

  const loadMore = useCallback(async () => {
    if (!enabled || state.loading || !state.hasMore) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchData(state.page + 1, pageSize);
      
      setState(prev => ({
        ...prev,
        data: [...prev.data, ...result.data],
        hasMore: result.hasMore,
        page: prev.page + 1,
        total: result.total,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load data',
        loading: false,
      }));
    }
  }, [enabled, fetchData, pageSize, state.loading, state.hasMore, state.page]);

  const reset = useCallback(() => {
    setState({
      data: [],
      loading: false,
      error: null,
      hasMore: true,
      page: 0,
      total: undefined,
    });
  }, []);

  const retry = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
    loadMore();
  }, [loadMore]);

  // Initial load
  useEffect(() => {
    if (enabled && state.page === 0 && state.data.length === 0 && !state.loading) {
      loadMore();
    }
  }, [enabled, loadMore, state.page, state.data.length, state.loading]);

  const { observerRef, isFetching } = useInfiniteScroll({
    hasMore: state.hasMore,
    loading: state.loading,
    onLoadMore: loadMore,
  });

  return {
    ...state,
    loadMore,
    reset,
    retry,
    observerRef,
    isFetching: isFetching || state.loading,
  };
}

// Hook for virtual scroll position management
export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  itemCount: number;
  itemHeight: number | ((index: number) => number);
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  const getItemHeight = useCallback((index: number) => {
    return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight;
  }, [itemHeight]);

  const visibleRange = useMemo(() => {
    if (typeof itemHeight === 'number') {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        itemCount - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight)
      );

      return {
        start: Math.max(0, startIndex - overscan),
        end: Math.min(itemCount - 1, endIndex + overscan),
      };
    }

    // For dynamic heights, we'd need more complex calculation
    // This is a simplified version
    let currentHeight = 0;
    let startIndex = 0;
    let endIndex = itemCount - 1;

    for (let i = 0; i < itemCount; i++) {
      const height = getItemHeight(i);
      
      if (currentHeight + height > scrollTop && startIndex === 0) {
        startIndex = i;
      }
      
      if (currentHeight > scrollTop + containerHeight) {
        endIndex = i;
        break;
      }
      
      currentHeight += height;
    }

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(itemCount - 1, endIndex + overscan),
    };
  }, [scrollTop, containerHeight, itemCount, getItemHeight, overscan]);

  const totalHeight = useMemo(() => {
    if (typeof itemHeight === 'number') {
      return itemCount * itemHeight;
    }

    let height = 0;
    for (let i = 0; i < itemCount; i++) {
      height += getItemHeight(i);
    }
    return height;
  }, [itemCount, getItemHeight]);

  const getItemOffset = useCallback((index: number) => {
    if (typeof itemHeight === 'number') {
      return index * itemHeight;
    }

    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i);
    }
    return offset;
  }, [getItemHeight]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollTop,
    isScrolling,
    visibleRange,
    totalHeight,
    getItemHeight,
    getItemOffset,
    handleScroll,
  };
}