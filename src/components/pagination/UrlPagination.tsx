"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  getPageRange: () => number[];
  className?: string;
  showPageSizeSelector?: boolean;
  showInfo?: boolean;
  pageSizeOptions?: number[];
}

export const UrlPagination = React.memo<UrlPaginationProps>(function UrlPagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onPageSizeChange,
  getPageRange,
  className,
  showPageSizeSelector = true,
  showInfo = true,
  pageSizeOptions = [5, 10, 20, 50, 100]
}) {
  const pageRange = getPageRange();
  const startItem = ((page - 1) * pageSize) + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  const renderPageButton = (pageNum: number) => {
    const isCurrentPage = pageNum === page;
    
    return (
      <Button
        key={pageNum}
        variant={isCurrentPage ? "default" : "outline"}
        size="sm"
        onClick={() => onPageChange(pageNum)}
        className={cn(
          "w-9 h-9",
          isCurrentPage && "bg-primary text-primary-foreground"
        )}
      >
        {pageNum}
      </Button>
    );
  };

  const renderEllipsis = (key: string) => (
    <div key={key} className="flex items-center justify-center w-9 h-9">
      <MoreHorizontal className="w-4 h-4 text-gray-400" />
    </div>
  );

  const renderPageButtons = () => {
    const buttons = [];
    const range = pageRange;

    // Always show first page
    if (range[0] > 1) {
      buttons.push(renderPageButton(1));
      if (range[0] > 2) {
        buttons.push(renderEllipsis('start-ellipsis'));
      }
    }

    // Show page range
    range.forEach(pageNum => {
      buttons.push(renderPageButton(pageNum));
    });

    // Always show last page
    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) {
        buttons.push(renderEllipsis('end-ellipsis'));
      }
      buttons.push(renderPageButton(totalPages));
    }

    return buttons;
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Page info */}
      {showInfo && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Page size selector */}
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value, 10))}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          {/* First page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={!hasPrevPage}
            className="w-9 h-9"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage}
            className="w-9 h-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Page numbers */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {renderPageButtons()}
            </div>
          )}

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
            className="w-9 h-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage}
            className="w-9 h-9"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

// Compact version for smaller spaces
export const CompactUrlPagination = React.memo<Omit<UrlPaginationProps, 'showPageSizeSelector' | 'showInfo'>>(
  function CompactUrlPagination({
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    onPageChange,
    className
  }) {
    if (totalPages <= 1) {
      return null;
    }

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }
);