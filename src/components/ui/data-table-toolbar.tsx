"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Download } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  searchKeys?: string[]
  searchPlaceholder?: string
  showExport?: boolean
  onExport?: () => void
  filterOptions?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  showExport = false,
  onExport,
  filterOptions = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  // Use global filter for multi-field search
  const globalFilter = table.getState().globalFilter || ""

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value)
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filterOptions.map((filter) => (
          <DataTableFacetedFilter
            key={filter.columnId}
            column={table.getColumn(filter.columnId)}
            title={filter.title}
            options={filter.options}
          />
        ))}
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
        {showExport && onExport && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
} 