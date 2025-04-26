"use client"

import * as LabelPrimitive from "@radix-ui/react-label"

import { LabelProps } from "./label.types"
import { useLabel } from "./use-label"

function Label(props: LabelProps) {
  const { children, className, ...rest } = useLabel(props)

  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={className}
      {...rest}
    >
      {children}
    </LabelPrimitive.Root>
  )
}

export { Label }
