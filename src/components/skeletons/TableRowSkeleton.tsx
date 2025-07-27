"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TableRowSkeletonProps {
  columns?: number;
  showActions?: boolean;
  showCheckbox?: boolean;
  animated?: boolean;
  className?: string;
}

export function TableRowSkeleton({ 
  columns = 4,
  showActions = true,
  showCheckbox = false,
  animated = true,
  className 
}: TableRowSkeletonProps) {
  return (
    <tr className={cn("border-b border-gray-200 dark:border-gray-700", className)}>
      {showCheckbox && (
        <td className="px-4 py-3">
          <Skeleton className={cn("h-4 w-4", animated && "animate-pulse")} />
        </td>
      )}
      
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <Skeleton className={cn(
            "h-4",
            index === 0 ? "w-32" : index === columns - 1 ? "w-20" : "w-24",
            animated && "animate-pulse"
          )} />
        </td>
      ))}
      
      {showActions && (
        <td className="px-4 py-3">
          <div className="flex items-center justify-end space-x-2">
            <Skeleton className={cn("h-8 w-8 rounded", animated && "animate-pulse")} />
            <Skeleton className={cn("h-8 w-8 rounded", animated && "animate-pulse")} />
          </div>
        </td>
      )}
    </tr>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  showPagination?: boolean;
  className?: string;
  rowProps?: Omit<TableRowSkeletonProps, 'className'>;
}

export function TableSkeleton({ 
  rows = 5,
  columns = 4,
  showHeader = true,
  showPagination = true,
  className,
  rowProps = {}
}: TableSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Table Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-64 animate-pulse" />
          <Skeleton className="h-10 w-24 animate-pulse" />
        </div>
        <Skeleton className="h-10 w-32 animate-pulse" />
      </div>

      {/* Table */}
      <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          {showHeader && (
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {rowProps.showCheckbox && (
                  <th className="px-4 py-3">
                    <Skeleton className="h-4 w-4 animate-pulse" />
                  </th>
                )}
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-20 animate-pulse" />
                  </th>
                ))}
                {rowProps.showActions && (
                  <th className="px-4 py-3">
                    <Skeleton className="h-4 w-16 animate-pulse" />
                  </th>
                )}
              </tr>
            </thead>
          )}
          <tbody className="bg-white dark:bg-gray-900">
            {Array.from({ length: rows }).map((_, index) => (
              <TableRowSkeleton 
                key={index} 
                columns={columns} 
                {...rowProps} 
              />
            ))}
          </tbody>
        </table>

        {showPagination && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48 animate-pulse" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 animate-pulse" />
                <Skeleton className="h-8 w-8 animate-pulse" />
                <Skeleton className="h-8 w-8 animate-pulse" />
                <Skeleton className="h-8 w-8 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}