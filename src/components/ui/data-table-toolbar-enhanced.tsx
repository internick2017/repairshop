"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Download, Filter, ChevronDown, Calendar, CheckSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { DataTableDateRangeFilter } from "./data-table-date-range-filter"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DataTableToolbarEnhancedProps<TData> {
  table: Table<TData>
  searchKey?: string
  searchKeys?: string[]
  searchPlaceholder?: string
  showExport?: boolean
  onExport?: (format: 'csv' | 'json' | 'excel') => void
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
  filterPresets?: {
    label: string
    filters: ColumnFiltersState
  }[]
  selectedRowsCount?: number
  totalRowsCount?: number
}

import { ColumnFiltersState } from "@tanstack/react-table"

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  showExport = false,
  onExport,
  filterOptions = [],
  dateFilterColumns = [],
  filterPresets = [],
  selectedRowsCount = 0,
  totalRowsCount = 0,
}: DataTableToolbarEnhancedProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const globalFilter = table.getState().globalFilter || ""

  const activeFiltersCount = table.getState().columnFilters.length + (globalFilter ? 1 : 0)

  const applyFilterPreset = (filters: ColumnFiltersState) => {
    table.resetColumnFilters()
    filters.forEach((filter) => {
      table.getColumn(filter.id)?.setFilterValue(filter.value)
    })
  }

  const handleBulkAction = (action: string) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    console.log(`Performing ${action} on ${selectedRows.length} rows`)
    // Implement bulk actions here
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* Enhanced Search Input */}
          <div className="relative">
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value)
              }}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-8 px-2"
                onClick={() => table.setGlobalFilter("")}
              >
                <Cross2Icon className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Faceted Filters */}
          {filterOptions.map((filter) => (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={table.getColumn(filter.columnId)}
              title={filter.title}
              options={filter.options}
            />
          ))}

          {/* Date Range Filters */}
          {dateFilterColumns.map((columnId) => {
            const column = table.getColumn(columnId);
            if (!column) {
              console.warn(`Column with id '${columnId}' does not exist.`);
              return null;
            }
            return (
              <DataTableDateRangeFilter
                key={columnId}
                column={column}
                title={columnId}
              />
            );
          })}

          {/* Filter Presets */}
          {filterPresets.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="mr-2 h-4 w-4" />
                  Quick Filters
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                {filterPresets.map((preset, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => applyFilterPreset(preset.filters)}
                  >
                    {preset.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Active Filters Badge */}
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="h-8 px-3">
              {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          )}

          {/* Reset Filters */}
          {(isFiltered || globalFilter) && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters()
                table.setGlobalFilter("")
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Bulk Actions */}
          {selectedRowsCount > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Actions ({selectedRowsCount})
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                  Delete Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
                  Archive Selected
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                  Export Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export Options */}
          {showExport && onExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('excel')}>
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Results Summary */}
      {totalRowsCount > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {totalRowsCount} results
          {selectedRowsCount > 0 && ` • ${selectedRowsCount} selected`}
        </div>
      )}
    </div>
  )
}