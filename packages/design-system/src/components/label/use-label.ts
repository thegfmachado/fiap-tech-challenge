import type { LabelProps } from "./label.types";
import { cn } from "../../lib/utils";

export function useLabel(props: LabelProps) {
  const { children, className, ...rest } = props

  const combinedClassNames = cn(
    "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    className
  );

  return {
    ...rest,
    children,
    className: combinedClassNames,
  }
}
