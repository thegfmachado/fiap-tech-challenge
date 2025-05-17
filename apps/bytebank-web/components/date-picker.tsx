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

interface DatePickerBaseProps {
  className?: string
  mode: "single" | "range"
  fitParent?: boolean
}

type DatePickerSingleProps = DatePickerBaseProps & {
  mode: "single"
  value?: Date
  onChange?: (date: Date | undefined) => void
}

type DatePickerRangeProps = DatePickerBaseProps & {
  mode: "range"
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
}

type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps

const isDayPickerRange = (props: DatePickerProps): props is DatePickerRangeProps => {
  return props.mode === "range"
}

function DatePickerPlaceholder(props: DatePickerProps) {
  if (isDayPickerRange(props)) {
    const { from, to } = props.value || {}

    return from && to
      ? `${formatDate(from, "medium")} - ${formatDate(to, "medium")}`
      : "Selecionar intervalo"
  }

  return props.value ? formatDate(props.value, "medium") : "Selecionar data"
}

export function DatePicker(props: DatePickerProps) {
  const { className, fitParent } = props

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !props.value && "text-muted-foreground",
              fitParent ? "w-full" : "w-[300px]",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <DatePickerPlaceholder {...props} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* @ts-expect-error ignorando para simplicidade, os tipos do DatePicker garantem o tipo certo */}
          <Calendar
            autoFocus
            mode={props.mode}
            selected={props.value}
            onSelect={props.onChange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
