"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"
import { Calendar as CalendarIcon } from "lucide-react"

import { Calendar } from "./ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

import { Button } from "@fiap-tech-challenge/design-system/components"
import { cn } from "@fiap-tech-challenge/design-system/lib/utils";

import { formatDate } from "app/client/formatters"

type DatePickerProps = {
  className?: string
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
}

export function DatePicker({
  className,
  value,
  onChange,
}: DatePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value)

  React.useEffect(() => {
    setDate(value)
  }, [value])

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range)
    onChange?.(range)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatDate(date.from, "medium")} - {formatDate(date.to, "medium")}
                </>
              ) : (
                formatDate(date.from, "medium")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
