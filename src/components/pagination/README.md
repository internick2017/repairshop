# Pagination and Virtualization Components

A comprehensive set of React components and hooks for handling large datasets efficiently with pagination, virtual scrolling, and infinite scroll patterns.

## Features

- 🚀 **High Performance** - Handle thousands of items with minimal performance impact
- 📱 **Responsive Design** - Works seamlessly across all device sizes
- ♿ **Accessibility** - Full keyboard navigation and screen reader support
- 🎨 **Customizable** - Flexible styling and theming options
- 🔧 **TypeScript** - Full type safety and IntelliSense support
- 📊 **Multiple Strategies** - Choose the best approach for your data

## Components

### Pagination

Classic pagination controls with page size selection and navigation.

```tsx
import { Pagination, SimplePagination, PaginationInfo } from '@/components/pagination';

// Full-featured pagination
<Pagination
  currentPage={page}
  totalPages={Math.ceil(totalItems / pageSize)}
  onPageChange={setPage}
  pageSize={pageSize}
  onPageSizeChange={setPageSize}
  totalItems={totalItems}
  showPageSizeSelector={true}
  showInfo={true}
/>

// Simple previous/next pagination
<SimplePagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>

// Just the info display
<PaginationInfo
  currentPage={page}
  pageSize={pageSize}
  totalItems={totalItems}
/>
```

### Virtual Scrolling

Render only visible items for optimal performance with large datasets.

```tsx
import { VirtualList, VirtualTable } from '@/components/pagination';

// Virtual list for custom items
<VirtualList
  items={largeDataset}
  itemHeight={60} // or (index, item) => calculateHeight(item)
  containerHeight={400}
  renderItem={(item, index, style) => (
    <div style={style} className="p-4 border-b">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  )}
  overscan={5}
  onScroll={(scrollTop) => console.log('Scrolled to:', scrollTop)}
/>

// Virtual table for tabular data
<VirtualTable
  data={customers}
  columns={[
    { key: 'name', header: 'Name', width: 200 },
    { key: 'email', header: 'Email', width: 250 },
    { key: 'status', header: 'Status', render: (value) => <Badge>{value}</Badge> }
  ]}
  rowHeight={48}
  containerHeight={600}
  onRowClick={(customer) => selectCustomer(customer)}
/>
```

### Infinite Scroll

Load data progressively as users scroll, perfect for social feeds and search results.

```tsx
import { InfiniteScroll, InfiniteTable, InfiniteGrid } from '@/components/pagination';

// Infinite scroll list
<InfiniteScroll
  items={items}
  hasMore={hasMore}
  loading={loading}
  error={error}
  onLoadMore={loadMore}
  renderItem={(item, index) => (
    <div className="p-4 border rounded mb-4">
      <h3>{item.title}</h3>
      <p>{item.content}</p>
    </div>
  )}
  threshold={200} // Load more when 200px from bottom
/>

// Infinite scroll table
<InfiniteTable
  data={tickets}
  columns={columns}
  hasMore={hasMore}
  loading={loading}
  onLoadMore={loadMore}
  onRowClick={selectTicket}
/>

// Infinite scroll grid
<InfiniteGrid
  items={products}
  hasMore={hasMore}
  loading={loading}
  onLoadMore={loadMore}
  renderItem={(product) => <ProductCard product={product} />}
  columns={3}
  gap={4}
/>
```

### DataTable

All-in-one table component with pagination, virtual scrolling, infinite scroll, sorting, and filtering.

```tsx
import { DataTable } from '@/components/pagination';

<DataTable
  data={customers}
  columns={[
    { 
      key: 'name', 
      header: 'Customer Name', 
      sortable: true,
      render: (value, customer) => (
        <div className="flex items-center space-x-2">
          <Avatar src={customer.avatar} />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { key: 'email', header: 'Email', sortable: true, filterable: true },
    { key: 'status', header: 'Status', render: (value) => <StatusBadge status={value} /> },
    { 
      key: 'created', 
      header: 'Created', 
      sortable: true,
      accessor: (customer) => customer.createdAt,
      render: (value) => formatDate(value)
    }
  ]}
  
  // Enable pagination
  pagination={{
    enabled: true,
    pageSize: 25,
    currentPage: page,
    onPageChange: setPage,
    onPageSizeChange: setPageSize,
    totalItems: totalCustomers
  }}
  
  // Or enable virtual scrolling for better performance
  virtualScroll={{
    enabled: true,
    containerHeight: 600,
    itemHeight: 72
  }}
  
  // Or enable infinite scroll for continuous loading
  infiniteScroll={{
    enabled: true,
    hasMore: hasMore,
    loading: loading,
    onLoadMore: loadMore
  }}
  
  // Enable features
  searchable={true}
  sortable={true}
  filterable={true}
  exportable={true}
  columnToggle={true}
  
  // Callbacks
  onRowClick={selectCustomer}
  onSort={handleSort}
  onFilter={handleFilter}
  onSearch={handleSearch}
  onExport={exportCustomers}
/>
```

## Hooks

### usePagination

Manage pagination state and calculations.

```tsx
import { usePagination, usePaginatedData } from '@/hooks/usePagination';

function CustomerList() {
  const [paginationState, paginationActions] = usePagination({
    totalItems: customers.length,
    initialPageSize: 20,
    initialPage: 1
  });

  const {
    currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage
  } = paginationState;

  const {
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    firstPage,
    lastPage
  } = paginationActions;

  // Or use the convenience hook for arrays
  const [paginatedCustomers, state, actions] = usePaginatedData(customers, 25);

  return (
    <div>
      {paginatedCustomers.map(customer => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
      
      <Pagination
        currentPage={state.currentPage}
        totalPages={state.totalPages}
        onPageChange={actions.setPage}
        pageSize={state.pageSize}
        onPageSizeChange={actions.setPageSize}
        totalItems={customers.length}
      />
    </div>
  );
}
```

### useInfiniteScroll

Handle infinite scroll functionality and data loading.

```tsx
import { useInfiniteScroll, useInfiniteData } from '@/hooks/useInfiniteScroll';

function InfiniteTicketList() {
  // Simple intersection observer hook
  const { observerRef, isFetching } = useInfiniteScroll({
    hasMore: hasMoreTickets,
    loading: loading,
    onLoadMore: loadMoreTickets,
    threshold: 300
  });

  // Or full data management hook
  const {
    data: tickets,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    retry,
    observerRef,
    isFetching
  } = useInfiniteData({
    fetchData: async (page, pageSize) => {
      const result = await fetchTickets({ page, pageSize });
      return {
        data: result.tickets,
        hasMore: result.page < result.totalPages,
        total: result.total
      };
    },
    pageSize: 20,
    enabled: true
  });

  return (
    <div>
      {tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
      
      {/* Observer target */}
      <div ref={observerRef} />
      
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} onRetry={retry} />}
    </div>
  );
}
```

### useVirtualization

Advanced virtualization with dynamic item sizes and bidirectional scrolling.

```tsx
import { useVirtualization, useBidirectionalVirtualization } from '@/hooks/useVirtualization';

function VirtualizedList() {
  const {
    virtualItems,
    totalSize,
    scrollToIndex,
    measureItem,
    setScrollElementRef
  } = useVirtualization({
    count: items.length,
    getItemSize: (index) => items[index].height || 60,
    estimateSize: 60,
    overscan: 5
  });

  return (
    <div
      ref={setScrollElementRef}
      style={{ height: 400, overflow: 'auto' }}
    >
      <div style={{ height: totalSize, position: 'relative' }}>
        {virtualItems.map(virtualItem => (
          <div
            key={virtualItem.index}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              left: 0,
              right: 0,
              height: virtualItem.size,
            }}
          >
            <ItemComponent
              item={items[virtualItem.index]}
              onMeasure={(element) => measureItem(virtualItem.index, element)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Bidirectional virtualization for grids
function VirtualizedGrid() {
  const {
    rows,
    columns,
    totalHeight,
    totalWidth,
    scrollToRow,
    scrollToColumn,
    setScrollElementRef
  } = useBidirectionalVirtualization({
    rowCount: 1000,
    columnCount: 50,
    getRowHeight: () => 40,
    getColumnWidth: (index) => index === 0 ? 200 : 100,
    overscanRows: 5,
    overscanColumns: 2
  });

  return (
    <div
      ref={setScrollElementRef}
      style={{ height: 600, width: 800, overflow: 'auto' }}
    >
      <div style={{ height: totalHeight, width: totalWidth, position: 'relative' }}>
        {rows.map(row =>
          columns.map(column => (
            <div
              key={`${row.index}-${column.index}`}
              style={{
                position: 'absolute',
                top: row.start,
                left: column.start,
                height: row.size,
                width: column.size,
              }}
            >
              Cell {row.index},{column.index}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

## Performance Optimization Strategies

### When to Use Each Approach

#### Traditional Pagination
**Best for:**
- Forms and admin interfaces
- When users need to navigate to specific pages
- Small to medium datasets (< 10,000 items)
- When you need precise page-based URLs

**Performance:** Good for up to 10,000 items

#### Virtual Scrolling
**Best for:**
- Large datasets (10,000+ items) that fit in memory
- When you need smooth scrolling experience
- File explorers, code editors, data grids
- When item heights are consistent or calculable

**Performance:** Excellent for 100,000+ items

#### Infinite Scroll
**Best for:**
- Social media feeds, search results
- When data is loaded from APIs
- Mobile-first applications
- When users typically consume content sequentially

**Performance:** Excellent with proper data management

### Performance Tips

1. **Use React.memo** for expensive list items:
```tsx
const ExpensiveListItem = React.memo(({ item, style }) => (
  <div style={style}>
    {/* Expensive rendering logic */}
  </div>
));
```

2. **Implement proper key strategies**:
```tsx
// Use stable IDs when possible
{items.map(item => (
  <div key={item.id}>{item.content}</div>
))}

// For virtual lists, use index + id
{virtualItems.map(virtualItem => (
  <div key={`${virtualItem.index}-${items[virtualItem.index].id}`}>
    {/* content */}
  </div>
))}
```

3. **Optimize data fetching**:
```tsx
// Implement request deduplication
const fetchTickets = useMemo(() => 
  debounce(async (page) => {
    // Fetch logic
  }, 300),
  []
);

// Use React Query or SWR for caching
const { data, error, isLoading } = useQuery(
  ['tickets', page],
  () => fetchTickets(page),
  { keepPreviousData: true }
);
```

4. **Memory management for infinite scroll**:
```tsx
const useInfiniteDataWithCleanup = () => {
  const [data, setData] = useState([]);
  
  const loadMore = useCallback(async () => {
    const newData = await fetchMore();
    
    setData(prev => {
      const combined = [...prev, ...newData];
      // Keep only last 1000 items in memory
      return combined.slice(-1000);
    });
  }, []);
};
```

## Accessibility Features

All components include comprehensive accessibility support:

- **Keyboard Navigation** - Arrow keys, Page Up/Down, Home/End
- **Screen Reader Support** - Proper ARIA labels and live regions
- **Focus Management** - Logical tab order and focus indicators
- **High Contrast** - Works with system high contrast modes
- **Reduced Motion** - Respects user motion preferences

## Browser Support

- **Modern Browsers** - Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Intersection Observer** - Required for infinite scroll (polyfill available)
- **ResizeObserver** - Used for dynamic sizing (polyfill available)

## Migration Guide

### From React Window
```tsx
// Before (react-window)
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={60}
>
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>

// After (our VirtualList)
<VirtualList
  items={items}
  itemHeight={60}
  containerHeight={600}
  renderItem={(item, index, style) => (
    <div style={style}>{item.name}</div>
  )}
/>
```

### From React Paginate
```tsx
// Before (react-paginate)
import ReactPaginate from 'react-paginate';

<ReactPaginate
  pageCount={totalPages}
  onPageChange={({ selected }) => setPage(selected + 1)}
  pageRangeDisplayed={5}
/>

// After (our Pagination)
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  totalItems={totalItems}
  showInfo={true}
/>
```