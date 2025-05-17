import type React from "react";
import type { VariantProps } from "class-variance-authority"

import { buttonVariants } from "./use-button"

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
  asChild?: boolean
}
