"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface VirtualItem {
  index: number;
  start: number;
  size: number;
  end: number;
}

interface UseVirtualizationProps {
  count: number;
  getItemSize: (index: number) => number;
  estimateSize?: number;
  overscan?: number;
  scrollMargin?: number;
  getScrollElement?: () => HTMLElement | null;
  initialOffset?: number;
  initialIndex?: number;
}

export function useVirtualization({
  count,
  getItemSize,
  estimateSize = 50,
  overscan = 5,
  scrollMargin = 0,
  getScrollElement,
  initialOffset = 0,
  initialIndex = 0,
}: UseVirtualizationProps) {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
  const [scrollOffset, setScrollOffset] = useState(initialOffset);
  const [isScrolling, setIsScrolling] = useState(false);
  const [measuredCache, setMeasuredCache] = useState<Map<number, number>>(new Map());
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const resizeObserverRef = useRef<ResizeObserver>();

  // Set scroll element
  const setScrollElementRef = useCallback((element: HTMLElement | null) => {
    setScrollElement(element);
  }, []);

  // Get the actual scroll element
  const currentScrollElement = getScrollElement ? getScrollElement() : scrollElement;

  // Memoized item measurements
  const itemSizeCache = useMemo(() => {
    const cache = new Map<number, number>();
    
    for (let i = 0; i < count; i++) {
      const measured = measuredCache.get(i);
      if (measured !== undefined) {
        cache.set(i, measured);
      } else {
        cache.set(i, getItemSize(i));
      }
    }
    
    return cache;
  }, [count, getItemSize, measuredCache]);

  // Calculate virtual items
  const virtualItems = useMemo((): VirtualItem[] => {
    if (!currentScrollElement) return [];

    const scrollElementHeight = currentScrollElement.clientHeight;
    const items: VirtualItem[] = [];
    let currentOffset = 0;

    // Find the first visible item
    let startIndex = 0;
    for (let i = 0; i < count; i++) {
      const size = itemSizeCache.get(i) || estimateSize;
      if (currentOffset + size >= scrollOffset - scrollMargin) {
        startIndex = i;
        break;
      }
      currentOffset += size;
    }

    // Reset offset to start of first visible item
    currentOffset = 0;
    for (let i = 0; i < startIndex; i++) {
      currentOffset += itemSizeCache.get(i) || estimateSize;
    }

    // Calculate visible and overscan items
    const startIndexWithOverscan = Math.max(0, startIndex - overscan);
    const visibleEnd = scrollOffset + scrollElementHeight + scrollMargin;

    for (let i = startIndexWithOverscan; i < count; i++) {
      const size = itemSizeCache.get(i) || estimateSize;
      
      items.push({
        index: i,
        start: currentOffset,
        size,
        end: currentOffset + size,
      });

      currentOffset += size;

      // Stop if we've gone past the visible area plus overscan
      if (currentOffset > visibleEnd + (overscan * estimateSize)) {
        break;
      }
    }

    return items;
  }, [
    currentScrollElement,
    count,
    scrollOffset,
    scrollMargin,
    overscan,
    itemSizeCache,
    estimateSize,
  ]);

  // Calculate total size
  const totalSize = useMemo(() => {
    let size = 0;
    for (let i = 0; i < count; i++) {
      size += itemSizeCache.get(i) || estimateSize;
    }
    return size;
  }, [count, itemSizeCache, estimateSize]);

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (!currentScrollElement) return;

    const offset = currentScrollElement.scrollTop;
    setScrollOffset(offset);
    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [currentScrollElement]);

  // Scroll to specific index
  const scrollToIndex = useCallback((
    index: number,
    options: { align?: 'start' | 'center' | 'end'; smooth?: boolean } = {}
  ) => {
    if (!currentScrollElement || index < 0 || index >= count) return;

    const { align = 'start', smooth = false } = options;
    let offset = 0;

    for (let i = 0; i < index; i++) {
      offset += itemSizeCache.get(i) || estimateSize;
    }

    const itemSize = itemSizeCache.get(index) || estimateSize;
    const scrollElementHeight = currentScrollElement.clientHeight;

    switch (align) {
      case 'center':
        offset -= (scrollElementHeight - itemSize) / 2;
        break;
      case 'end':
        offset -= scrollElementHeight - itemSize;
        break;
      default: // start
        break;
    }

    currentScrollElement.scrollTo({
      top: Math.max(0, offset),
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, [currentScrollElement, count, itemSizeCache, estimateSize]);

  // Scroll to specific offset
  const scrollToOffset = useCallback((
    offset: number,
    options: { smooth?: boolean } = {}
  ) => {
    if (!currentScrollElement) return;

    currentScrollElement.scrollTo({
      top: Math.max(0, Math.min(offset, totalSize - currentScrollElement.clientHeight)),
      behavior: options.smooth ? 'smooth' : 'auto',
    });
  }, [currentScrollElement, totalSize]);

  // Measure item size
  const measureItem = useCallback((index: number, element: HTMLElement) => {
    const size = element.getBoundingClientRect().height;
    setMeasuredCache(prev => new Map(prev).set(index, size));
  }, []);

  // Setup scroll listener
  useEffect(() => {
    if (!currentScrollElement) return;

    const element = currentScrollElement;
    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [currentScrollElement, handleScroll]);

  // Setup initial scroll position
  useEffect(() => {
    if (initialIndex > 0) {
      scrollToIndex(initialIndex);
    }
  }, [initialIndex, scrollToIndex]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  return {
    virtualItems,
    totalSize,
    scrollOffset,
    isScrolling,
    scrollToIndex,
    scrollToOffset,
    measureItem,
    setScrollElementRef,
  };
}

// Hook for bidirectional virtualization (both horizontal and vertical)
interface UseBidirectionalVirtualizationProps {
  rowCount: number;
  columnCount: number;
  getRowHeight: (index: number) => number;
  getColumnWidth: (index: number) => number;
  estimateRowHeight?: number;
  estimateColumnWidth?: number;
  overscanRows?: number;
  overscanColumns?: number;
}

export function useBidirectionalVirtualization({
  rowCount,
  columnCount,
  getRowHeight,
  getColumnWidth,
  estimateRowHeight = 50,
  estimateColumnWidth = 100,
  overscanRows = 5,
  overscanColumns = 5,
}: UseBidirectionalVirtualizationProps) {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const rowVirtualization = useVirtualization({
    count: rowCount,
    getItemSize: getRowHeight,
    estimateSize: estimateRowHeight,
    overscan: overscanRows,
    getScrollElement: () => scrollElement,
  });

  const columnVirtualization = useVirtualization({
    count: columnCount,
    getItemSize: getColumnWidth,
    estimateSize: estimateColumnWidth,
    overscan: overscanColumns,
    getScrollElement: () => scrollElement,
  });

  const handleScroll = useCallback(() => {
    if (!scrollElement) return;
    
    setScrollTop(scrollElement.scrollTop);
    setScrollLeft(scrollElement.scrollLeft);
  }, [scrollElement]);

  useEffect(() => {
    if (!scrollElement) return;

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [scrollElement, handleScroll]);

  return {
    rows: rowVirtualization.virtualItems,
    columns: columnVirtualization.virtualItems,
    totalHeight: rowVirtualization.totalSize,
    totalWidth: columnVirtualization.totalSize,
    scrollTop,
    scrollLeft,
    scrollToRow: rowVirtualization.scrollToIndex,
    scrollToColumn: columnVirtualization.scrollToIndex,
    measureRow: rowVirtualization.measureItem,
    measureColumn: columnVirtualization.measureItem,
    setScrollElementRef: setScrollElement,
  };
}