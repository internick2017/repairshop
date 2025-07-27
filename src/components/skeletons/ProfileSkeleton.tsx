"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProfileSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  showActions?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProfileSkeleton({ 
  size = 'md',
  showDetails = true,
  showActions = true,
  animated = true,
  className 
}: ProfileSkeletonProps) {
  const sizeClasses = {
    sm: { avatar: 'h-8 w-8', name: 'h-4 w-20', email: 'h-3 w-16' },
    md: { avatar: 'h-12 w-12', name: 'h-5 w-24', email: 'h-4 w-20' },
    lg: { avatar: 'h-16 w-16', name: 'h-6 w-32', email: 'h-4 w-24' },
  };

  const { avatar, name, email } = sizeClasses[size];

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <Skeleton className={cn(avatar, "rounded-full", animated && "animate-pulse")} />
      
      {showDetails && (
        <div className="flex-1 space-y-1">
          <Skeleton className={cn(name, animated && "animate-pulse")} />
          <Skeleton className={cn(email, animated && "animate-pulse")} />
        </div>
      )}
      
      {showActions && (
        <div className="flex items-center space-x-2">
          <Skeleton className={cn("h-8 w-8 rounded", animated && "animate-pulse")} />
        </div>
      )}
    </div>
  );
}

interface ProfileCardSkeletonProps {
  showCover?: boolean;
  showStats?: boolean;
  showBio?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProfileCardSkeleton({ 
  showCover = true,
  showStats = true,
  showBio = true,
  animated = true,
  className 
}: ProfileCardSkeletonProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden",
      className
    )}>
      {/* Cover Photo */}
      {showCover && (
        <Skeleton className={cn("h-32 w-full", animated && "animate-pulse")} />
      )}
      
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-start space-x-4 mb-6">
          <div className={cn("relative", showCover && "-mt-16")}>
            <Skeleton className={cn(
              "h-20 w-20 rounded-full border-4 border-white dark:border-gray-900",
              animated && "animate-pulse"
            )} />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className={cn("h-6 w-32", animated && "animate-pulse")} />
            <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
            {showBio && (
              <div className="space-y-2 mt-3">
                <Skeleton className={cn("h-4 w-full", animated && "animate-pulse")} />
                <Skeleton className={cn("h-4 w-3/4", animated && "animate-pulse")} />
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Skeleton className={cn("h-9 w-20", animated && "animate-pulse")} />
            <Skeleton className={cn("h-9 w-9", animated && "animate-pulse")} />
          </div>
        </div>
        
        {/* Stats */}
        {showStats && (
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="text-center space-y-2">
                <Skeleton className={cn("h-6 w-8 mx-auto", animated && "animate-pulse")} />
                <Skeleton className={cn("h-4 w-16 mx-auto", animated && "animate-pulse")} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProfileListSkeletonProps {
  count?: number;
  showStatus?: boolean;
  showRole?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProfileListSkeleton({ 
  count = 5,
  showStatus = true,
  showRole = true,
  animated = true,
  className 
}: ProfileListSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center space-x-4">
            <Skeleton className={cn("h-10 w-10 rounded-full", animated && "animate-pulse")} />
            <div className="space-y-2">
              <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
              <div className="flex items-center space-x-3">
                <Skeleton className={cn("h-3 w-20", animated && "animate-pulse")} />
                {showRole && (
                  <Skeleton className={cn("h-3 w-16", animated && "animate-pulse")} />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {showStatus && (
              <Skeleton className={cn("h-6 w-16 rounded-full", animated && "animate-pulse")} />
            )}
            <div className="flex space-x-2">
              <Skeleton className={cn("h-8 w-8 rounded", animated && "animate-pulse")} />
              <Skeleton className={cn("h-8 w-8 rounded", animated && "animate-pulse")} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}