"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export type CalendarProps = {
  mode?: "single" | "multiple" | "range"
  selected?: Date | Date[] | undefined
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  initialFocus?: boolean
  className?: string
}

// Simple calendar component - replace with react-day-picker for production
export function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  
  const days = []
  for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d))
  }
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }
  
  const handleDayClick = (date: Date) => {
    if (disabled && disabled(date)) return
    onSelect?.(date)
  }
  
  const isSelected = (date: Date) => {
    if (!selected) return false
    if (selected instanceof Date) {
      return selected.toDateString() === date.toDateString()
    }
    return false
  }
  
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="font-medium text-muted-foreground p-1">
            {day}
          </div>
        ))}
        {days.map((date, i) => {
          const isDisabled = disabled && disabled(date)
          return (
            <Button
              key={i}
              variant={isSelected(date) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleDayClick(date)}
              disabled={isDisabled}
              className="h-8 w-8 p-0 font-normal"
            >
              {date.getDate()}
            </Button>
          )
        })}
      </div>
    </div>
  )
}