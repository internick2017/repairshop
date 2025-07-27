// Pagination components
export { 
  Pagination, 
  SimplePagination, 
  PaginationInfo 
} from './Pagination';

// Virtual scrolling components
export { 
  VirtualList, 
  VirtualTable 
} from './VirtualList';

// Infinite scroll components
export { 
  InfiniteScroll, 
  InfiniteTable, 
  InfiniteGrid 
} from './InfiniteScroll';

// All-in-one data table
export { DataTable } from './DataTable';

// Types
export interface PaginationConfig {
  enabled: boolean;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
}

export interface VirtualScrollConfig {
  enabled: boolean;
  containerHeight: number;
  itemHeight?: number;
}

export interface InfiniteScrollConfig {
  enabled: boolean;
  hasMore: boolean;
  loading: boolean;
  error?: string | null;
  onLoadMore: () => void;
  onRetry?: () => void;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  accessor?: (item: T) => any;
  hidden?: boolean;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  key: string;
  value: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
}