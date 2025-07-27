"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SearchSkeletonProps {
  showFilters?: boolean;
  showResults?: boolean;
  resultCount?: number;
  animated?: boolean;
  className?: string;
}

export function SearchSkeleton({ 
  showFilters = true,
  showResults = true,
  resultCount = 3,
  animated = true,
  className 
}: SearchSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Skeleton className={cn("h-5 w-5", animated && "animate-pulse")} />
            <Skeleton className={cn("h-6 w-24", animated && "animate-pulse")} />
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Skeleton className={cn("h-10 w-full", animated && "animate-pulse")} />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className={cn("h-10 w-20", animated && "animate-pulse")} />
            <Skeleton className={cn("h-10 w-16", animated && "animate-pulse")} />
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className={cn("h-5 w-16", animated && "animate-pulse")} />
            <Skeleton className={cn("h-4 w-12", animated && "animate-pulse")} />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton 
                key={index}
                className={cn("h-8 w-20", animated && "animate-pulse")} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className={cn("h-6 w-32", animated && "animate-pulse")} />
            <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
          </div>
          
          <div className="space-y-3">
            {Array.from({ length: resultCount }).map((_, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className={cn("h-5 w-3/4", animated && "animate-pulse")} />
                    <Skeleton className={cn("h-4 w-1/2", animated && "animate-pulse")} />
                    <div className="flex items-center space-x-4 mt-3">
                      <Skeleton className={cn("h-3 w-20", animated && "animate-pulse")} />
                      <Skeleton className={cn("h-3 w-16", animated && "animate-pulse")} />
                      <Skeleton className={cn("h-3 w-24", animated && "animate-pulse")} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className={cn("h-8 w-8", animated && "animate-pulse")} />
                    <Skeleton className={cn("h-8 w-8", animated && "animate-pulse")} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface SearchResultSkeletonProps {
  type?: 'list' | 'grid' | 'table';
  count?: number;
  animated?: boolean;
  className?: string;
}

export function SearchResultSkeleton({ 
  type = 'list',
  count = 5,
  animated = true,
  className 
}: SearchResultSkeletonProps) {
  if (type === 'grid') {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4"
          >
            <div className="space-y-3">
              <Skeleton className={cn("h-5 w-3/4", animated && "animate-pulse")} />
              <Skeleton className={cn("h-4 w-1/2", animated && "animate-pulse")} />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className={cn("h-3 w-16", animated && "animate-pulse")} />
                <Skeleton className={cn("h-6 w-12", animated && "animate-pulse")} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={cn("rounded-md border border-gray-200 dark:border-gray-800", className)}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Skeleton className={cn("h-6 w-32", animated && "animate-pulse")} />
            <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
          </div>
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4 flex-1">
                <Skeleton className={cn("h-4 w-32", animated && "animate-pulse")} />
                <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
                <Skeleton className={cn("h-4 w-20", animated && "animate-pulse")} />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className={cn("h-8 w-8", animated && "animate-pulse")} />
                <Skeleton className={cn("h-8 w-8", animated && "animate-pulse")} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default list view
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className={cn("h-5 w-3/4", animated && "animate-pulse")} />
              <Skeleton className={cn("h-4 w-1/2", animated && "animate-pulse")} />
              <div className="flex items-center space-x-4 mt-3">
                <Skeleton className={cn("h-3 w-20", animated && "animate-pulse")} />
                <Skeleton className={cn("h-3 w-16", animated && "animate-pulse")} />
              </div>
            </div>
            <Skeleton className={cn("h-8 w-16", animated && "animate-pulse")} />
          </div>
        </div>
      ))}
    </div>
  );
}