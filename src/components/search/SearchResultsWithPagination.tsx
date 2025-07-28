"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SearchResultsWithPaginationProps<T> {
  results: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function SearchResultsWithPagination<T>({
  results,
  totalCount,
  page,
  pageSize,
  totalPages,
  onPageChange,
  renderItem,
  className,
  isLoading,
}: SearchResultsWithPaginationProps<T>) {
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalCount);

  if (isLoading) {
    return (
      <div className={className}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Search Results ({totalCount})
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex}-{endIndex} of {totalCount}
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {results.map((item, index) => (
            <React.Fragment key={index}>
              {renderItem(item, index)}
            </React.Fragment>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {generatePageNumbers(page, totalPages).map((pageNum, idx) => (
                  <React.Fragment key={idx}>
                    {pageNum === '...' ? (
                      <span className="px-2 text-gray-400">...</span>
                    ) : (
                      <Button
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(Number(pageNum))}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to generate page numbers with ellipsis
function generatePageNumbers(current: number, total: number): (number | string)[] {
  const delta = 2;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i as number;
  });

  return rangeWithDots;
}