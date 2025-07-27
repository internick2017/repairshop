"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FormFieldSkeletonProps {
  type?: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio';
  showLabel?: boolean;
  showDescription?: boolean;
  animated?: boolean;
  className?: string;
}

export function FormFieldSkeleton({ 
  type = 'input',
  showLabel = true, 
  showDescription = false,
  animated = true,
  className 
}: FormFieldSkeletonProps) {
  const getFieldHeight = () => {
    switch (type) {
      case 'textarea': return 'h-24';
      case 'select': return 'h-10';
      case 'checkbox':
      case 'radio': return 'h-5 w-5';
      default: return 'h-10';
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {showLabel && (
        <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
      )}
      
      {type === 'checkbox' || type === 'radio' ? (
        <div className="flex items-center space-x-3">
          <Skeleton className={cn(getFieldHeight(), "rounded", animated && "animate-pulse")} />
          <Skeleton className={cn("h-4 w-32", animated && "animate-pulse")} />
        </div>
      ) : (
        <Skeleton className={cn(getFieldHeight(), "w-full rounded", animated && "animate-pulse")} />
      )}
      
      {showDescription && (
        <Skeleton className={cn("h-3 w-48", animated && "animate-pulse")} />
      )}
    </div>
  );
}

interface FormSectionSkeletonProps {
  fieldCount?: number;
  columns?: 1 | 2 | 3;
  showTitle?: boolean;
  showDescription?: boolean;
  className?: string;
  fieldProps?: Omit<FormFieldSkeletonProps, 'className'>;
}

export function FormSectionSkeleton({ 
  fieldCount = 4,
  columns = 2,
  showTitle = true,
  showDescription = true,
  className,
  fieldProps = {}
}: FormSectionSkeletonProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={cn("space-y-6", className)}>
      {(showTitle || showDescription) && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          {showTitle && <Skeleton className="h-6 w-32 animate-pulse" />}
          {showDescription && <Skeleton className="h-4 w-48 mt-1 animate-pulse" />}
        </div>
      )}
      
      <div className={cn("grid gap-6", gridClasses[columns])}>
        {Array.from({ length: fieldCount }).map((_, index) => (
          <FormFieldSkeleton key={index} {...fieldProps} />
        ))}
      </div>
    </div>
  );
}

interface FormSkeletonProps {
  sectionCount?: number;
  className?: string;
  showActions?: boolean;
  sectionProps?: Omit<FormSectionSkeletonProps, 'className'>;
}

export function FormSkeleton({ 
  sectionCount = 3,
  className,
  showActions = true,
  sectionProps = {}
}: FormSkeletonProps) {
  return (
    <div className={cn(
      "max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800",
      className
    )}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 animate-pulse" />
            <Skeleton className="h-4 w-64 animate-pulse" />
          </div>
          <Skeleton className="h-6 w-24 animate-pulse" />
        </div>
      </div>
      
      <div className="p-6 space-y-8">
        {Array.from({ length: sectionCount }).map((_, index) => (
          <FormSectionSkeleton key={index} {...sectionProps} />
        ))}
        
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Skeleton className="h-12 flex-1 animate-pulse" />
            <Skeleton className="h-12 flex-1 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}