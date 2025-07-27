"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ListItemSkeletonProps {
  showAvatar?: boolean;
  showActions?: boolean;
  showMetadata?: boolean;
  animated?: boolean;
}

function ListItemSkeleton({ 
  showAvatar = true, 
  showActions = true, 
  showMetadata = true,
  animated = true 
}: ListItemSkeletonProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center space-x-4 flex-1">
        {showAvatar && (
          <Skeleton className={cn("h-10 w-10 rounded-full", animated && "animate-pulse")} />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton className={cn("h-4 w-3/4", animated && "animate-pulse")} />
          {showMetadata && (
            <div className="flex items-center space-x-4">
              <Skeleton className={cn("h-3 w-20", animated && "animate-pulse")} />
              <Skeleton className={cn("h-3 w-16", animated && "animate-pulse")} />
              <Skeleton className={cn("h-3 w-24", animated && "animate-pulse")} />
            </div>
          )}
        </div>
      </div>
      
      {showActions && (
        <div className="flex items-center space-x-2">
          <Skeleton className={cn("h-8 w-8 rounded", animated && "animate-pulse")} />
          <Skeleton className={cn("h-8 w-8 rounded", animated && "animate-pulse")} />
        </div>
      )}
    </div>
  );
}

interface ListSkeletonProps {
  count?: number;
  className?: string;
  showHeader?: boolean;
  itemProps?: ListItemSkeletonProps;
}

export function ListSkeleton({ 
  count = 5, 
  className,
  showHeader = true,
  itemProps = {} 
}: ListSkeletonProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800",
      className
    )}>
      {showHeader && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 animate-pulse" />
              <Skeleton className="h-4 w-48 animate-pulse" />
            </div>
            <Skeleton className="h-10 w-24 animate-pulse" />
          </div>
        </div>
      )}
      
      <div>
        {Array.from({ length: count }).map((_, index) => (
          <ListItemSkeleton key={index} {...itemProps} />
        ))}
      </div>
    </div>
  );
}

interface CompactListSkeletonProps {
  count?: number;
  className?: string;
  animated?: boolean;
}

export function CompactListSkeleton({ 
  count = 3, 
  className,
  animated = true 
}: CompactListSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Skeleton className={cn("h-8 w-8 rounded", animated && "animate-pulse")} />
            <div className="space-y-1">
              <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
              <Skeleton className={cn("h-3 w-16", animated && "animate-pulse")} />
            </div>
          </div>
          <Skeleton className={cn("h-6 w-12", animated && "animate-pulse")} />
        </div>
      ))}
    </div>
  );
}