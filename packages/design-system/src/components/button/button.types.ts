import type { VariantProps } from "class-variance-authority"
import type React from "react";

import type { buttonVariants } from "./use-button"

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
  asChild?: boolean
  readOnly?: boolean
}
