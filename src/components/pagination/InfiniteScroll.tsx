"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfiniteScrollProps<T> {
  items: T[];
  hasMore: boolean;
  loading: boolean;
  error?: string | null;
  onLoadMore: () => void;
  onRetry?: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  endComponent?: React.ReactNode;
  threshold?: number;
  className?: string;
  itemClassName?: string;
}

export function InfiniteScroll<T>({
  items,
  hasMore,
  loading,
  error,
  onLoadMore,
  onRetry,
  renderItem,
  loadingComponent,
  errorComponent,
  emptyComponent,
  endComponent,
  threshold = 200,
  className,
  itemClassName
}: InfiniteScrollProps<T>) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Intersection Observer for detecting when user reaches bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  // Load more when intersecting and conditions are met
  useEffect(() => {
    if (
      isIntersecting &&
      hasMore &&
      !loading &&
      !error &&
      !loadingRef.current
    ) {
      loadingRef.current = true;
      onLoadMore();
      
      // Reset loading ref after a delay to prevent rapid firing
      setTimeout(() => {
        loadingRef.current = false;
      }, 500);
    }
  }, [isIntersecting, hasMore, loading, error, onLoadMore]);

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    } else {
      onLoadMore();
    }
  }, [onRetry, onLoadMore]);

  if (items.length === 0 && !loading && !error) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        {emptyComponent || (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No items to display</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Items */}
      {items.map((item, index) => (
        <div
          key={index}
          className={cn("transition-opacity duration-200", itemClassName)}
        >
          {renderItem(item, index)}
        </div>
      ))}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          {loadingComponent || (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more items...</span>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center py-8">
          {errorComponent || (
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to load more items</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
            </div>
          )}
        </div>
      )}

      {/* End state */}
      {!hasMore && !loading && !error && items.length > 0 && (
        <div className="flex items-center justify-center py-8">
          {endComponent || (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>You've reached the end</p>
            </div>
          )}
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerRef} className="h-1" aria-hidden="true" />
    </div>
  );
}

interface InfiniteTableProps<T> {
  data: T[];
  columns: Array<{
    key: string;
    header: string;
    width?: string;
    render?: (value: any, item: T, index: number) => React.ReactNode;
  }>;
  hasMore: boolean;
  loading: boolean;
  error?: string | null;
  onLoadMore: () => void;
  onRetry?: () => void;
  onRowClick?: (item: T, index: number) => void;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  emptyMessage?: string;
}

export function InfiniteTable<T extends Record<string, any>>({
  data,
  columns,
  hasMore,
  loading,
  error,
  onLoadMore,
  onRetry,
  onRowClick,
  className,
  headerClassName,
  rowClassName,
  emptyMessage = "No data available"
}: InfiniteTableProps<T>) {
  const renderRow = useCallback((item: T, index: number) => {
    const rowClass = typeof rowClassName === 'function' 
      ? rowClassName(item, index) 
      : rowClassName;

    return (
      <tr
        className={cn(
          "border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
          onRowClick && "cursor-pointer",
          rowClass
        )}
        onClick={() => onRowClick?.(item, index)}
        role={onRowClick ? "button" : undefined}
        tabIndex={onRowClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onRowClick(item, index);
          }
        }}
      >
        {columns.map((column) => (
          <td
            key={column.key}
            className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
            style={{ width: column.width }}
          >
            {column.render 
              ? column.render(item[column.key], item, index)
              : item[column.key]
            }
          </td>
        ))}
      </tr>
    );
  }, [columns, onRowClick, rowClassName]);

  return (
    <div className={cn("border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={cn("bg-gray-50 dark:bg-gray-900", headerClassName)}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-700">
            <InfiniteScroll
              items={data}
              hasMore={hasMore}
              loading={loading}
              error={error}
              onLoadMore={onLoadMore}
              onRetry={onRetry}
              renderItem={renderRow}
              emptyComponent={
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              }
              className="divide-y divide-gray-200 dark:divide-gray-700"
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface InfiniteGridProps<T> {
  items: T[];
  hasMore: boolean;
  loading: boolean;
  error?: string | null;
  onLoadMore: () => void;
  onRetry?: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: number;
  className?: string;
  itemClassName?: string;
  emptyMessage?: string;
}

export function InfiniteGrid<T>({
  items,
  hasMore,
  loading,
  error,
  onLoadMore,
  onRetry,
  renderItem,
  columns = 3,
  gap = 4,
  className,
  itemClassName,
  emptyMessage = "No items found"
}: InfiniteGridProps<T>) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6',
  };

  const gapClass = `gap-${gap}`;

  const renderGridItem = useCallback((item: T, index: number) => (
    <div className={cn("transition-all duration-200", itemClassName)}>
      {renderItem(item, index)}
    </div>
  ), [renderItem, itemClassName]);

  return (
    <InfiniteScroll
      items={items}
      hasMore={hasMore}
      loading={loading}
      error={error}
      onLoadMore={onLoadMore}
      onRetry={onRetry}
      renderItem={renderGridItem}
      emptyComponent={
        <div className="text-center text-gray-500 dark:text-gray-400 py-12">
          <p>{emptyMessage}</p>
        </div>
      }
      className={cn("grid", gridCols[columns], gapClass, className)}
    />
  );
}