import * as React from "react"

import { cn } from "@fiap-tech-challenge/design-system/lib/utils"

export function Input({ className, disabled, readOnly, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      disabled={disabled || readOnly}
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        disabled && !readOnly && "disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}
