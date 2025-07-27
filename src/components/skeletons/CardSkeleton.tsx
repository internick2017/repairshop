"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  className?: string;
  showActions?: boolean;
  showAvatar?: boolean;
  lineCount?: number;
  animated?: boolean;
}

export function CardSkeleton({ 
  className, 
  showActions = true, 
  showAvatar = false, 
  lineCount = 3,
  animated = true 
}: CardSkeletonProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6",
      className
    )}>
      {/* Header with optional avatar */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {showAvatar && (
            <Skeleton className={cn("h-10 w-10 rounded-full", animated && "animate-pulse")} />
          )}
          <div className="space-y-2">
            <Skeleton className={cn("h-5 w-32", animated && "animate-pulse")} />
            <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
          </div>
        </div>
        {showActions && (
          <Skeleton className={cn("h-8 w-8 rounded", animated && "animate-pulse")} />
        )}
      </div>
      
      {/* Content lines */}
      <div className="space-y-3">
        {Array.from({ length: lineCount }).map((_, index) => (
          <Skeleton 
            key={index}
            className={cn(
              "h-4",
              index === lineCount - 1 ? "w-3/4" : "w-full",
              animated && "animate-pulse"
            )} 
          />
        ))}
      </div>
      
      {/* Footer actions */}
      {showActions && (
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Skeleton className={cn("h-8 w-16", animated && "animate-pulse")} />
          <Skeleton className={cn("h-8 w-20", animated && "animate-pulse")} />
        </div>
      )}
    </div>
  );
}

interface CardGridSkeletonProps {
  count?: number;
  className?: string;
  cardProps?: Omit<CardSkeletonProps, 'className'>;
}

export function CardGridSkeleton({ 
  count = 6, 
  className,
  cardProps = {}
}: CardGridSkeletonProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      className
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} {...cardProps} />
      ))}
    </div>
  );
}