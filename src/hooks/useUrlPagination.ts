"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface PaginationState {
  page: number;
  pageSize: number;
  search: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string>;
}

export interface UsePaginationReturn {
  // Current state
  page: number;
  pageSize: number;
  search: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters: Record<string, string>;
  
  // Computed values
  offset: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  
  // Navigation functions
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  setFilter: (key: string, value: string | null) => void;
  clearFilters: () => void;
  resetPagination: () => void;
  
  // URL management
  buildUrl: (params: Partial<PaginationState>) => string;
  getPageRange: () => number[];
}

interface UsePaginationOptions {
  defaultPageSize?: number;
  maxPageSize?: number;
  showPageRange?: number; // Number of page buttons to show
  totalItems?: number;
}

export function useUrlPagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const {
    defaultPageSize = 10,
    maxPageSize = 100,
    showPageRange = 5,
    totalItems = 0
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current URL parameters
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(
    maxPageSize,
    Math.max(1, parseInt(searchParams.get('pageSize') || defaultPageSize.toString(), 10))
  );
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || undefined;
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined;

  // Parse filters (all params except known pagination params)
  const filters = useMemo(() => {
    const knownParams = new Set(['page', 'pageSize', 'search', 'sortBy', 'sortOrder']);
    const filterObj: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      if (!knownParams.has(key)) {
        filterObj[key] = value;
      }
    });
    
    return filterObj;
  }, [searchParams]);

  // Computed values
  const offset = (page - 1) * pageSize;
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // URL building function
  const buildUrl = useCallback((params: Partial<PaginationState>): string => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Update page
    if (params.page !== undefined) {
      if (params.page <= 1) {
        newSearchParams.delete('page');
      } else {
        newSearchParams.set('page', params.page.toString());
      }
    }

    // Update page size
    if (params.pageSize !== undefined) {
      if (params.pageSize === defaultPageSize) {
        newSearchParams.delete('pageSize');
      } else {
        newSearchParams.set('pageSize', params.pageSize.toString());
      }
    }

    // Update search
    if (params.search !== undefined) {
      if (params.search.trim() === '') {
        newSearchParams.delete('search');
      } else {
        newSearchParams.set('search', params.search);
      }
    }

    // Update sorting
    if (params.sortBy !== undefined) {
      if (params.sortBy === '') {
        newSearchParams.delete('sortBy');
        newSearchParams.delete('sortOrder');
      } else {
        newSearchParams.set('sortBy', params.sortBy);
        newSearchParams.set('sortOrder', params.sortOrder || 'asc');
      }
    }

    // Update filters
    if (params.filters !== undefined) {
      // Remove existing filter params
      Object.keys(filters).forEach(key => {
        newSearchParams.delete(key);
      });
      
      // Add new filter params
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          newSearchParams.set(key, value);
        }
      });
    }

    const queryString = newSearchParams.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [searchParams, pathname, defaultPageSize, filters]);

  // Navigation functions
  const updateUrl = useCallback((params: Partial<PaginationState>) => {
    const newUrl = buildUrl(params);
    router.push(newUrl, { scroll: false });
  }, [buildUrl, router]);

  const setPage = useCallback((newPage: number) => {
    const clampedPage = Math.max(1, Math.min(totalPages || 1, newPage));
    updateUrl({ page: clampedPage });
  }, [updateUrl, totalPages]);

  const setPageSize = useCallback((newPageSize: number) => {
    const clampedPageSize = Math.min(maxPageSize, Math.max(1, newPageSize));
    // Reset to page 1 when changing page size
    updateUrl({ page: 1, pageSize: clampedPageSize });
  }, [updateUrl, maxPageSize]);

  const setSearch = useCallback((newSearch: string) => {
    // Reset to page 1 when searching
    updateUrl({ page: 1, search: newSearch });
  }, [updateUrl]);

  const setSorting = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    updateUrl({ sortBy: newSortBy, sortOrder: newSortOrder });
  }, [updateUrl]);

  const setFilter = useCallback((key: string, value: string | null) => {
    const newFilters = { ...filters };
    if (value === null || value.trim() === '') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    // Reset to page 1 when filtering
    updateUrl({ page: 1, filters: newFilters });
  }, [updateUrl, filters]);

  const clearFilters = useCallback(() => {
    updateUrl({ page: 1, filters: {} });
  }, [updateUrl]);

  const resetPagination = useCallback(() => {
    updateUrl({ 
      page: 1, 
      pageSize: defaultPageSize, 
      search: '', 
      sortBy: '', 
      filters: {} 
    });
  }, [updateUrl, defaultPageSize]);

  // Get page range for pagination controls
  const getPageRange = useCallback((): number[] => {
    if (totalPages <= showPageRange) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(showPageRange / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + showPageRange - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < showPageRange) {
      start = Math.max(1, end - showPageRange + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages, showPageRange]);

  return {
    // Current state
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    filters,
    
    // Computed values
    offset,
    totalPages,
    hasNextPage,
    hasPrevPage,
    
    // Navigation functions
    setPage,
    setPageSize,
    setSearch,
    setSorting,
    setFilter,
    clearFilters,
    resetPagination,
    
    // URL management
    buildUrl,
    getPageRange,
  };
}

// Hook for pagination with data
export function usePaginatedData<T>(
  data: T[],
  options: UsePaginationOptions = {}
) {
  const pagination = useUrlPagination({
    ...options,
    totalItems: data.length
  });

  // Get current page data
  const currentPageData = useMemo(() => {
    const start = pagination.offset;
    const end = start + pagination.pageSize;
    return data.slice(start, end);
  }, [data, pagination.offset, pagination.pageSize]);

  return {
    ...pagination,
    data: currentPageData,
    totalItems: data.length
  };
}