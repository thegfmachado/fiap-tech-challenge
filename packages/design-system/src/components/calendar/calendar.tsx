"use client"

import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "../../lib/utils"
import { buttonVariants } from "../button/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "absolute top-0 right-0 flex p-3 gap-2 w-full justify-between z-1",
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent has-[>svg]:p-0 opacity-50 hover:opacity-1004",
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent has-[>svg]:p-0 opacity-50 hover:opacity-100",
        ),
        month_grid: "w-full border-collapse space-x-1",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 rounded-md",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal",
        ),
        range_start: "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground rounded-l-md [&:not(.day-range-end)]:rounded-r-none",
        range_end: "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground rounded-r-md [&:not(.day-range-start)]:rounded-l-none",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground rounded-none",
        selected: cn(
          "[&>button]:bg-inherit [&>button]:text-inherit [&>button]:hover:bg-inherit [&>button]:hover:text-inherit",
          props.mode === "single" && "aria-selected:bg-primary aria-selected:text-primary-foreground rounded-md",
        ),
        today: "bg-accent text-accent-foreground",
        outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeft {...props} className={cn("size-4", props.className)} />
          }

          return <ChevronRight {...props} className={cn("size-4", props.className)} />
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
