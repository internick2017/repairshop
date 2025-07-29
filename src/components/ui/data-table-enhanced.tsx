"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
  SortingFn,
  Row,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar-enhanced"
import { exportToCSV, exportToJSON, exportToExcel } from "@/lib/export-utils"

// Custom filter functions
const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  const cellValue = row.getValue(columnId)
  if (!value || !cellValue) return true
  
  const searchValue = value.toString().toLowerCase()
  const stringValue = cellValue.toString().toLowerCase()
  
  return stringValue.includes(searchValue)
}

const dateRangeFilter: FilterFn<any> = (row, columnId, value) => {
  if (!value || !Array.isArray(value)) return true
  
  const cellValue = row.getValue(columnId)
  if (!cellValue) return true
  
  const date = new Date(cellValue)
  if (isNaN(date.getTime())) return true
  
  const [start, end] = value
  
  if (!start && !end) return true
  
  if (start && !end) {
    const startDate = new Date(start)
    return isNaN(startDate.getTime()) ? true : date >= startDate
  }
  
  if (!start && end) {
    const endDate = new Date(end)
    return isNaN(endDate.getTime()) ? true : date <= endDate
  }
  
  const startDate = new Date(start)
  const endDate = new Date(end)
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return true
  
  return date >= startDate && date <= endDate
}

// Custom sorting functions
const dateSortingFn: SortingFn<any> = (rowA, rowB, columnId) => {
  const dateA = new Date(rowA.getValue(columnId))
  const dateB = new Date(rowB.getValue(columnId))
  return dateA.getTime() - dateB.getTime()
}

interface DataTableEnhancedProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchKeys?: string[]
  searchPlaceholder?: string
  showToolbar?: boolean
  showPagination?: boolean
  showExport?: boolean
  exportFilename?: string
  filterOptions?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  dateFilterColumns?: string[]
  defaultSorting?: SortingState
  enableMultiSort?: boolean
  enableColumnResizing?: boolean
  stickyHeader?: boolean
  filterPresets?: {
    label: string
    filters: ColumnFiltersState
  }[]
  onRowClick?: (row: Row<TData>) => void
}

export function DataTableEnhanced<TData, TValue>({
  columns,
  data,
  searchKey,
  searchKeys,
  searchPlaceholder = "Search...",
  showToolbar = true,
  showPagination = true,
  showExport = false,
  exportFilename = "data",
  filterOptions = [],
  dateFilterColumns = [],
  defaultSorting = [],
  enableMultiSort = true,
  enableColumnResizing = false,
  stickyHeader = false,
  filterPresets = [],
  onRowClick,
}: DataTableEnhancedProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
      dateRange: dateRangeFilter,
    },
    sortingFns: {
      datetime: dateSortingFn,
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    enableMultiSort,
    enableColumnResizing,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: fuzzyFilter,
  })

  const handleExport = React.useCallback((format: 'csv' | 'json' | 'excel') => {
    const filteredData = table.getFilteredRowModel().rows.map(row => row.original);
    const exportColumns = columns
      .filter(col => col.id !== "select" && col.id !== "actions")
      .map(col => ({
        key: col.id || (col as { accessorKey?: string }).accessorKey || "",
        header: typeof col.header === "string" ? col.header : col.id || ""
      }))
      .filter(col => col.key);
    
    switch(format) {
      case 'csv':
        exportToCSV(filteredData, exportFilename, exportColumns);
        break;
      case 'json':
        exportToJSON(filteredData, exportFilename);
        break;
      case 'excel':
        if (typeof exportToExcel === 'function') {
          exportToExcel(filteredData, exportFilename, exportColumns);
        } else {
          exportToCSV(filteredData, exportFilename, exportColumns);
        }
        break;
    }
  }, [table, columns, exportFilename])

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length
  const totalRowsCount = table.getFilteredRowModel().rows.length

  return (
    <div className="space-y-4">
      {showToolbar && (
        <DataTableToolbar 
          table={table} 
          searchKey={searchKey}
          searchKeys={searchKeys}
          searchPlaceholder={searchPlaceholder}
          filterOptions={filterOptions}
          dateFilterColumns={dateFilterColumns}
          filterPresets={filterPresets}
          showExport={showExport}
          onExport={handleExport}
          selectedRowsCount={selectedRowsCount}
          totalRowsCount={totalRowsCount}
        />
      )}
      <div className={`rounded-md border ${stickyHeader ? 'overflow-auto max-h-[600px]' : ''}`}>
        <Table role="table" aria-label="Data table">
          <TableHeader className={stickyHeader ? 'sticky top-0 bg-background z-10' : ''}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id} 
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
                      }}
                      className={enableColumnResizing ? 'relative' : ''}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {enableColumnResizing && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none ${
                            header.column.getIsResizing() ? 'bg-primary' : 'bg-border'
                          }`}
                        />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={() => onRowClick?.(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && <DataTablePagination table={table} />}
    </div>
  )
}