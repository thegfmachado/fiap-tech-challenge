import { cva } from "class-variance-authority";
import { cn } from "@fiap-tech-challenge/design-system/lib/utils";
import { Slot } from "@radix-ui/react-slot";

import type { ButtonProps } from "./button.types";

export const BUTTON_DEFAULT_PROPS: Pick<ButtonProps, 'asChild' | 'disabled' | 'variant' | 'size'> = {
  asChild: false,
  disabled: false,
  variant: "primary",
  size: "md",
};

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        md: "h-10 px-4 py-2 has-[>svg]:px-3",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

export function useButton(props: ButtonProps) {
  const {
    asChild = BUTTON_DEFAULT_PROPS.asChild,
    className,
    disabled = BUTTON_DEFAULT_PROPS.disabled,
    readOnly,
    variant,
    size,
    ...rest
  } = props

  const combinedClassNames = cn(
    buttonVariants({ variant, size }),
    disabled && !readOnly && "disabled:opacity-50",
    className,
  )

  const Comp = asChild ? Slot : "button";

  return {
    ...rest,
    className: combinedClassNames,
    disabled: disabled || readOnly,

    Comp,
  }
}
