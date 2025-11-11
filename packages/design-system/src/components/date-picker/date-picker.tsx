"use client"

import { DateRange } from "react-day-picker"
import { Calendar as CalendarIcon } from "lucide-react"

import { formatDate } from "@fiap-tech-challenge/utils"
import { Calendar } from "../calendar/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover"
import { Button } from "../button/button"
import { cn } from "../../lib/utils"

export type { DateRange }

interface DatePickerBaseProps {
  className?: string
  disabled?: boolean
  mode: "single" | "range"
  fitParent?: boolean
  readOnly?: boolean
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

    if (from && to) {
      return from?.toISOString() === to?.toISOString()
        ? `${formatDate(from)}`
        : `${formatDate(from)} - ${formatDate(to)}`
    }

    return "Selecionar datas"
  }

  return props.value ? formatDate(props.value) : "Selecionar data"
}

export function DatePicker(props: DatePickerProps) {
  const { className, disabled, fitParent, readOnly } = props

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            readOnly={readOnly}
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

