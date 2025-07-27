"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VirtualTable } from './VirtualList';
import { Pagination } from './Pagination';
import { InfiniteTable } from './InfiniteScroll';

interface Column<T> {
  key: string;
  header: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  accessor?: (item: T) => any;
  hidden?: boolean;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  key: string;
  value: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  
  // Pagination
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    totalItems?: number;
  };
  
  // Virtual scrolling
  virtualScroll?: {
    enabled: boolean;
    containerHeight: number;
    itemHeight?: number;
  };
  
  // Infinite scroll
  infiniteScroll?: {
    enabled: boolean;
    hasMore: boolean;
    loading: boolean;
    error?: string | null;
    onLoadMore: () => void;
    onRetry?: () => void;
  };
  
  // Features
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  columnToggle?: boolean;
  
  // Callbacks
  onRowClick?: (item: T, index: number) => void;
  onSort?: (config: SortConfig) => void;
  onFilter?: (filters: FilterConfig[]) => void;
  onSearch?: (query: string) => void;
  onExport?: () => void;
  
  // Styling
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  
  // Loading and empty states
  loading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  pagination,
  virtualScroll,
  infiniteScroll,
  searchable = false,
  sortable = true,
  filterable = false,
  exportable = false,
  columnToggle = false,
  onRowClick,
  onSort,
  onFilter,
  onSearch,
  onExport,
  className,
  headerClassName,
  rowClassName,
  loading = false,
  emptyMessage = "No data available",
  loadingMessage = "Loading..."
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());

  // Filter visible columns
  const visibleColumns = useMemo(() => {
    return initialColumns.filter(column => !hiddenColumns.has(column.key) && !column.hidden);
  }, [initialColumns, hiddenColumns]);

  // Handle search
  const filteredData = useMemo(() => {
    if (!searchQuery && filters.length === 0) return data;

    return data.filter(item => {
      // Search filter
      if (searchQuery) {
        const searchMatch = visibleColumns.some(column => {
          const value = column.accessor ? column.accessor(item) : item[column.key];
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        });
        if (!searchMatch) return false;
      }

      // Column filters
      if (filters.length > 0) {
        const filterMatch = filters.every(filter => {
          const value = String(item[filter.key]).toLowerCase();
          const filterValue = filter.value.toLowerCase();

          switch (filter.operator) {
            case 'contains':
              return value.includes(filterValue);
            case 'equals':
              return value === filterValue;
            case 'startsWith':
              return value.startsWith(filterValue);
            case 'endsWith':
              return value.endsWith(filterValue);
            default:
              return true;
          }
        });
        if (!filterMatch) return false;
      }

      return true;
    });
  }, [data, searchQuery, filters, visibleColumns]);

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const column = visibleColumns.find(col => col.key === sortConfig.key);
      const aValue = column?.accessor ? column.accessor(a) : a[sortConfig.key];
      const bValue = column?.accessor ? column.accessor(b) : b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, visibleColumns]);

  // Paginated data for standard pagination
  const paginatedData = useMemo(() => {
    if (!pagination?.enabled) return sortedData;
    
    const startIndex = ((pagination.currentPage || 1) - 1) * (pagination.pageSize || 10);
    const endIndex = startIndex + (pagination.pageSize || 10);
    
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, pagination]);

  // Handle sort click
  const handleSort = useCallback((columnKey: string) => {
    if (!sortable) return;

    const newSortConfig: SortConfig = {
      key: columnKey,
      direction: sortConfig?.key === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    };

    setSortConfig(newSortConfig);
    onSort?.(newSortConfig);
  }, [sortable, sortConfig, onSort]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  // Handle column toggle
  const handleColumnToggle = useCallback((columnKey: string, visible: boolean) => {
    setHiddenColumns(prev => {
      const newSet = new Set(prev);
      if (visible) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  }, []);

  // Determine which data to use based on scrolling mode
  const displayData = infiniteScroll?.enabled ? sortedData : 
                     pagination?.enabled ? paginatedData : 
                     sortedData;

  // Render table header
  const renderHeader = () => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        {searchable && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        )}

        {filterable && (
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {columnToggle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {initialColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={!hiddenColumns.has(column.key)}
                  onCheckedChange={(checked) => handleColumnToggle(column.key, checked)}
                >
                  {column.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {exportable && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </div>
    </div>
  );

  // Render table content based on scroll mode
  const renderTable = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">{loadingMessage}</p>
          </div>
        </div>
      );
    }

    if (infiniteScroll?.enabled) {
      return (
        <InfiniteTable
          data={displayData}
          columns={visibleColumns}
          hasMore={infiniteScroll.hasMore}
          loading={infiniteScroll.loading}
          error={infiniteScroll.error}
          onLoadMore={infiniteScroll.onLoadMore}
          onRetry={infiniteScroll.onRetry}
          onRowClick={onRowClick}
          rowClassName={rowClassName}
          emptyMessage={emptyMessage}
        />
      );
    }

    if (virtualScroll?.enabled) {
      return (
        <VirtualTable
          data={displayData}
          columns={visibleColumns}
          rowHeight={virtualScroll.itemHeight}
          containerHeight={virtualScroll.containerHeight}
          onRowClick={onRowClick}
          rowClassName={rowClassName}
          emptyMessage={emptyMessage}
        />
      );
    }

    // Standard table
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={cn("bg-gray-50 dark:bg-gray-900", headerClassName)}>
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                    column.sortable && sortable && "cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortable && sortConfig?.key === column.key && (
                      <span className="text-blue-500">
                        {sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-700">
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="px-4 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              displayData.map((item, index) => {
                const rowClass = typeof rowClassName === 'function' 
                  ? rowClassName(item, index) 
                  : rowClassName;

                return (
                  <tr
                    key={index}
                    className={cn(
                      "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                      onRowClick && "cursor-pointer",
                      rowClass
                    )}
                    onClick={() => onRowClick?.(item, index)}
                  >
                    {visibleColumns.map((column) => (
                      <td
                        key={column.key}
                        className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                        style={{ width: column.width }}
                      >
                        {column.render 
                          ? column.render(
                              column.accessor ? column.accessor(item) : item[column.key], 
                              item, 
                              index
                            )
                          : (column.accessor ? column.accessor(item) : item[column.key])
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={cn("bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden", className)}>
      {(searchable || filterable || exportable || columnToggle) && renderHeader()}
      
      {renderTable()}
      
      {pagination?.enabled && !infiniteScroll?.enabled && !virtualScroll?.enabled && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            currentPage={pagination.currentPage || 1}
            totalPages={Math.ceil((pagination.totalItems || filteredData.length) / (pagination.pageSize || 10))}
            onPageChange={pagination.onPageChange || (() => {})}
            pageSize={pagination.pageSize}
            onPageSizeChange={pagination.onPageSizeChange}
            totalItems={pagination.totalItems || filteredData.length}
          />
        </div>
      )}
    </div>
  );
}