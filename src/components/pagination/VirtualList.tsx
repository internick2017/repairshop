"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number | ((index: number, item: T) => number);
  containerHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  scrollToIndex?: number;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

interface ItemMetadata {
  offset: number;
  size: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className,
  onScroll,
  scrollToIndex,
  loading = false,
  loadingComponent,
  emptyComponent
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate item metadata for dynamic heights
  const itemMetadata = useMemo(() => {
    const metadata: ItemMetadata[] = [];
    let offset = 0;

    for (let i = 0; i < items.length; i++) {
      const size = typeof itemHeight === 'function' ? itemHeight(i, items[i]) : itemHeight;
      metadata[i] = { offset, size };
      offset += size;
    }

    return metadata;
  }, [items, itemHeight]);

  const totalHeight = useMemo(() => {
    if (itemMetadata.length === 0) return 0;
    const lastItem = itemMetadata[itemMetadata.length - 1];
    return lastItem.offset + lastItem.size;
  }, [itemMetadata]);

  // Binary search to find start index
  const findStartIndex = useCallback((scrollTop: number) => {
    let low = 0;
    let high = itemMetadata.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midOffset = itemMetadata[mid].offset;

      if (midOffset === scrollTop) {
        return mid;
      } else if (midOffset < scrollTop) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return Math.max(0, low - 1);
  }, [itemMetadata]);

  // Calculate visible items
  const visibleItems = useMemo(() => {
    if (itemMetadata.length === 0) return [];

    const startIndex = findStartIndex(scrollTop);
    const endIndex = itemMetadata.findIndex(
      item => item.offset >= scrollTop + containerHeight
    );

    const actualEndIndex = endIndex === -1 ? itemMetadata.length - 1 : endIndex;
    
    // Add overscan
    const overscanStartIndex = Math.max(0, startIndex - overscan);
    const overscanEndIndex = Math.min(itemMetadata.length - 1, actualEndIndex + overscan);

    const visible = [];
    for (let i = overscanStartIndex; i <= overscanEndIndex; i++) {
      const item = items[i];
      const metadata = itemMetadata[i];
      
      visible.push({
        index: i,
        item,
        style: {
          position: 'absolute' as const,
          top: metadata.offset,
          left: 0,
          right: 0,
          height: metadata.size,
        }
      });
    }

    return visible;
  }, [scrollTop, containerHeight, itemMetadata, items, overscan, findStartIndex]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    setIsScrolling(true);
    onScroll?.(scrollTop);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set timeout to detect scroll end
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [onScroll]);

  // Scroll to specific index
  useEffect(() => {
    if (scrollToIndex !== undefined && scrollElementRef.current && itemMetadata[scrollToIndex]) {
      const targetOffset = itemMetadata[scrollToIndex].offset;
      scrollElementRef.current.scrollTop = targetOffset;
    }
  }, [scrollToIndex, itemMetadata]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ height: containerHeight }}>
        {loadingComponent || (
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ height: containerHeight }}>
        {emptyComponent || (
          <div className="text-center text-gray-500">
            <p>No items to display</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={scrollElementRef}
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      role="list"
      aria-label="Virtual list"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, style }) => (
          <div key={index} style={style} role="listitem">
            {renderItem(item, index, style)}
          </div>
        ))}
      </div>
      
      {/* Scroll indicator */}
      {isScrolling && items.length > 10 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm z-10">
          {Math.round((scrollTop / (totalHeight - containerHeight)) * 100)}%
        </div>
      )}
    </div>
  );
}

interface VirtualTableProps<T> {
  data: T[];
  columns: Array<{
    key: string;
    header: string;
    width?: number;
    render?: (value: any, item: T, index: number) => React.ReactNode;
  }>;
  rowHeight?: number;
  containerHeight: number;
  onRowClick?: (item: T, index: number) => void;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  loading?: boolean;
  emptyMessage?: string;
}

export function VirtualTable<T extends Record<string, any>>({
  data,
  columns,
  rowHeight = 48,
  containerHeight,
  onRowClick,
  className,
  headerClassName,
  rowClassName,
  loading = false,
  emptyMessage = "No data available"
}: VirtualTableProps<T>) {
  const headerHeight = 40;
  const listHeight = containerHeight - headerHeight;

  const renderRow = useCallback((item: T, index: number, style: React.CSSProperties) => {
    const rowClass = typeof rowClassName === 'function' 
      ? rowClassName(item, index) 
      : rowClassName;

    return (
      <div
        style={style}
        className={cn(
          "flex items-center border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors",
          index % 2 === 0 && "bg-white dark:bg-gray-950",
          index % 2 === 1 && "bg-gray-50/50 dark:bg-gray-900/50",
          rowClass
        )}
        onClick={() => onRowClick?.(item, index)}
        role="row"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRowClick?.(item, index);
          }
        }}
      >
        {columns.map((column, colIndex) => (
          <div
            key={column.key}
            className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 truncate"
            style={{ 
              width: column.width ? `${column.width}px` : 'auto',
              flex: column.width ? 'none' : 1
            }}
            role="cell"
          >
            {column.render 
              ? column.render(item[column.key], item, index)
              : item[column.key]
            }
          </div>
        ))}
      </div>
    );
  }, [columns, onRowClick, rowClassName]);

  return (
    <div className={cn("border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden", className)}>
      {/* Header */}
      <div 
        className={cn(
          "flex bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700",
          headerClassName
        )}
        style={{ height: headerHeight }}
        role="rowgroup"
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate"
            style={{ 
              width: column.width ? `${column.width}px` : 'auto',
              flex: column.width ? 'none' : 1
            }}
            role="columnheader"
          >
            {column.header}
          </div>
        ))}
      </div>

      {/* Virtual List */}
      <VirtualList
        items={data}
        itemHeight={rowHeight}
        containerHeight={listHeight}
        renderItem={renderRow}
        loading={loading}
        emptyComponent={
          <div className="text-center text-gray-500 py-8">
            <p>{emptyMessage}</p>
          </div>
        }
      />
    </div>
  );
}