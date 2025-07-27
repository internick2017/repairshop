"use client";

import { useState, useMemo, useCallback } from 'react';

interface UsePaginationProps {
  totalItems: number;
  initialPageSize?: number;
  initialPage?: number;
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationActions {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  goToPage: (page: number) => void;
}

export function usePagination({
  totalItems,
  initialPageSize = 10,
  initialPage = 1
}: UsePaginationProps): [PaginationState, PaginationActions] {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginationState = useMemo((): PaginationState => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    return {
      currentPage,
      pageSize,
      totalPages,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [currentPage, pageSize, totalItems]);

  const setPage = useCallback((page: number) => {
    const maxPage = Math.ceil(totalItems / pageSize);
    const validPage = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(validPage);
  }, [totalItems, pageSize]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    const currentIndex = (currentPage - 1) * pageSize;
    const newPage = Math.floor(currentIndex / newPageSize) + 1;
    
    setPageSize(newPageSize);
    setCurrentPage(newPage);
  }, [currentPage, pageSize]);

  const nextPage = useCallback(() => {
    if (paginationState.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, paginationState.hasNextPage]);

  const previousPage = useCallback(() => {
    if (paginationState.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, paginationState.hasPreviousPage]);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setCurrentPage(paginationState.totalPages);
  }, [paginationState.totalPages]);

  const goToPage = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  const actions: PaginationActions = {
    setPage,
    setPageSize: handlePageSizeChange,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    goToPage,
  };

  return [paginationState, actions];
}

// Hook for paginating arrays
export function usePaginatedData<T>(
  data: T[],
  initialPageSize = 10
): [T[], PaginationState, PaginationActions] {
  const [paginationState, paginationActions] = usePagination({
    totalItems: data.length,
    initialPageSize,
  });

  const paginatedData = useMemo(() => {
    return data.slice(paginationState.startIndex, paginationState.endIndex);
  }, [data, paginationState.startIndex, paginationState.endIndex]);

  return [paginatedData, paginationState, paginationActions];
}