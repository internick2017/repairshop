"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardSkeletonProps {
  showIcon?: boolean;
  showTrend?: boolean;
  animated?: boolean;
  className?: string;
}

export function StatCardSkeleton({ 
  showIcon = true,
  showTrend = true,
  animated = true,
  className 
}: StatCardSkeletonProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
          <Skeleton className={cn("h-8 w-16", animated && "animate-pulse")} />
          {showTrend && (
            <div className="flex items-center space-x-2">
              <Skeleton className={cn("h-3 w-3", animated && "animate-pulse")} />
              <Skeleton className={cn("h-3 w-12", animated && "animate-pulse")} />
            </div>
          )}
        </div>
        {showIcon && (
          <Skeleton className={cn("h-12 w-12 rounded-lg", animated && "animate-pulse")} />
        )}
      </div>
    </div>
  );
}

interface StatsGridSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4;
  cardProps?: Omit<StatCardSkeletonProps, 'className'>;
  className?: string;
}

export function StatsGridSkeleton({ 
  count = 4,
  columns = 4,
  cardProps = {},
  className 
}: StatsGridSkeletonProps) {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn("grid gap-6", gridClasses[columns], className)}>
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index} {...cardProps} />
      ))}
    </div>
  );
}

interface ChartSkeletonProps {
  type?: 'line' | 'bar' | 'pie' | 'area';
  showLegend?: boolean;
  showAxis?: boolean;
  animated?: boolean;
  className?: string;
}

export function ChartSkeleton({ 
  type = 'line',
  showLegend = true,
  showAxis = true,
  animated = true,
  className 
}: ChartSkeletonProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6",
      className
    )}>
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className={cn("h-6 w-32", animated && "animate-pulse")} />
          <Skeleton className={cn("h-4 w-48", animated && "animate-pulse")} />
        </div>
        {showLegend && (
          <div className="flex items-center space-x-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton className={cn("h-3 w-3 rounded-full", animated && "animate-pulse")} />
                <Skeleton className={cn("h-3 w-16", animated && "animate-pulse")} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Chart Area */}
      <div className="relative">
        {type === 'pie' ? (
          <div className="flex items-center justify-center h-64">
            <Skeleton className={cn("h-48 w-48 rounded-full", animated && "animate-pulse")} />
          </div>
        ) : (
          <>
            {/* Y-axis */}
            {showAxis && (
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between w-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className={cn("h-3 w-6", animated && "animate-pulse")} />
                ))}
              </div>
            )}
            
            {/* Chart content */}
            <div className={cn("ml-8 mb-8", showAxis && "mr-4")}>
              <div className="h-64 flex items-end justify-between space-x-2">
                {type === 'bar' ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton 
                      key={index}
                      className={cn(
                        "w-8",
                        `h-${Math.floor(Math.random() * 48) + 16}`,
                        animated && "animate-pulse"
                      )} 
                    />
                  ))
                ) : (
                  <Skeleton className={cn("w-full h-full", animated && "animate-pulse")} />
                )}
              </div>
            </div>
            
            {/* X-axis */}
            {showAxis && (
              <div className="ml-8 flex justify-between">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className={cn("h-3 w-8", animated && "animate-pulse")} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface AnalyticsSkeletonProps {
  showStats?: boolean;
  showCharts?: boolean;
  statCount?: number;
  chartCount?: number;
  animated?: boolean;
  className?: string;
}

export function AnalyticsSkeleton({ 
  showStats = true,
  showCharts = true,
  statCount = 4,
  chartCount = 2,
  animated = true,
  className 
}: AnalyticsSkeletonProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Page Header */}
      <div className="space-y-2">
        <Skeleton className={cn("h-8 w-48", animated && "animate-pulse")} />
        <Skeleton className={cn("h-4 w-64", animated && "animate-pulse")} />
      </div>
      
      {/* Stats Grid */}
      {showStats && (
        <StatsGridSkeleton 
          count={statCount} 
          cardProps={{ animated }} 
        />
      )}
      
      {/* Charts */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.from({ length: chartCount }).map((_, index) => (
            <ChartSkeleton 
              key={index}
              type={index % 2 === 0 ? 'line' : 'bar'}
              animated={animated}
            />
          ))}
        </div>
      )}
    </div>
  );
}