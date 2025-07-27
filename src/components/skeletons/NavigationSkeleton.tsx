"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NavigationSkeletonProps {
  showLogo?: boolean;
  showProfile?: boolean;
  itemCount?: number;
  animated?: boolean;
  className?: string;
}

export function NavigationSkeleton({ 
  showLogo = true,
  showProfile = true,
  itemCount = 4,
  animated = true,
  className 
}: NavigationSkeletonProps) {
  return (
    <header className={cn(
      "bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {showLogo && (
            <div className="flex items-center space-x-3">
              <Skeleton className={cn("h-8 w-8 rounded", animated && "animate-pulse")} />
              <Skeleton className={cn("h-6 w-32", animated && "animate-pulse")} />
            </div>
          )}
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {Array.from({ length: itemCount }).map((_, index) => (
              <Skeleton 
                key={index}
                className={cn("h-4 w-16", animated && "animate-pulse")} 
              />
            ))}
          </div>
          
          {/* Profile */}
          {showProfile && (
            <div className="flex items-center space-x-3">
              <Skeleton className={cn("h-8 w-8 rounded-full", animated && "animate-pulse")} />
              <div className="hidden sm:block space-y-1">
                <Skeleton className={cn("h-4 w-20", animated && "animate-pulse")} />
                <Skeleton className={cn("h-3 w-16", animated && "animate-pulse")} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface BreadcrumbSkeletonProps {
  levels?: number;
  animated?: boolean;
  className?: string;
}

export function BreadcrumbSkeleton({ 
  levels = 3,
  animated = true,
  className 
}: BreadcrumbSkeletonProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)} aria-label="Breadcrumb">
      {Array.from({ length: levels }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Skeleton className={cn("h-4 w-16", animated && "animate-pulse")} />
          {index < levels - 1 && (
            <Skeleton className={cn("h-3 w-3", animated && "animate-pulse")} />
          )}
        </div>
      ))}
    </nav>
  );
}

interface SidebarSkeletonProps {
  itemCount?: number;
  showHeader?: boolean;
  showGroups?: boolean;
  animated?: boolean;
  className?: string;
}

export function SidebarSkeleton({ 
  itemCount = 6,
  showHeader = true,
  showGroups = true,
  animated = true,
  className 
}: SidebarSkeletonProps) {
  return (
    <aside className={cn(
      "w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full",
      className
    )}>
      {showHeader && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Skeleton className={cn("h-8 w-8 rounded", animated && "animate-pulse")} />
            <Skeleton className={cn("h-6 w-24", animated && "animate-pulse")} />
          </div>
        </div>
      )}
      
      <div className="p-4 space-y-6">
        {showGroups ? (
          <>
            {/* First group */}
            <div className="space-y-3">
              <Skeleton className={cn("h-4 w-20", animated && "animate-pulse")} />
              <div className="space-y-2">
                {Array.from({ length: Math.ceil(itemCount / 2) }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2">
                    <Skeleton className={cn("h-4 w-4", animated && "animate-pulse")} />
                    <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Second group */}
            <div className="space-y-3">
              <Skeleton className={cn("h-4 w-16", animated && "animate-pulse")} />
              <div className="space-y-2">
                {Array.from({ length: Math.floor(itemCount / 2) }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2">
                    <Skeleton className={cn("h-4 w-4", animated && "animate-pulse")} />
                    <Skeleton className={cn("h-4 w-20", animated && "animate-pulse")} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: itemCount }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3 p-2">
                <Skeleton className={cn("h-4 w-4", animated && "animate-pulse")} />
                <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}