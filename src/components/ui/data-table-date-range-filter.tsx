"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

// Simple date format function
const format = (date: Date, formatStr: string) => {
  const options: Intl.DateTimeFormatOptions = formatStr === "MMM d" 
    ? { month: 'short', day: 'numeric' }
    : { year: 'numeric', month: '2-digit', day: '2-digit' }
  return date.toLocaleDateString('en-US', options)
}

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

interface DataTableDateRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
}

export function DataTableDateRangeFilter<TData, TValue>({
  column,
  title,
}: DataTableDateRangeFilterProps<TData, TValue>) {
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [isOpen, setIsOpen] = React.useState(false)

  const displayTitle = title || column?.id || "Date"

  React.useEffect(() => {
    if (dateRange.from || dateRange.to) {
      column?.setFilterValue([dateRange.from, dateRange.to])
    } else {
      column?.setFilterValue(undefined)
    }
  }, [dateRange, column])

  const handleReset = () => {
    setDateRange({ from: undefined, to: undefined })
    column?.setFilterValue(undefined)
    setIsOpen(false)
  }

  const isFiltered = dateRange.from || dateRange.to

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayTitle}
          {isFiltered && (
            <>
              <span className="mx-2">:</span>
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {dateRange.from && format(dateRange.from, "MMM d")}
                {dateRange.from && dateRange.to && " - "}
                {dateRange.to && format(dateRange.to, "MMM d")}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">From</div>
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={(date) =>
                setDateRange((prev) => ({ ...prev, from: date }))
              }
              disabled={(date) =>
                date > new Date() || (dateRange.to ? date > dateRange.to : false)
              }
              initialFocus
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">To</div>
            <Calendar
              mode="single"
              selected={dateRange.to}
              onSelect={(date) =>
                setDateRange((prev) => ({ ...prev, to: date }))
              }
              disabled={(date) =>
                date > new Date() || (dateRange.from ? date < dateRange.from : false)
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsOpen(false)
              }}
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}