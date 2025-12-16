import type { FormMessageProps } from "./form-message.types";
import { cn } from "../../../lib/utils";
import { useFormField } from "../form-field/use-form-field";

export function useFormMessage(props: FormMessageProps) {
  const { children, className, ...rest } = props

  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  const combinedClassNames = cn(
    "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    className
  );

  return {
    ...rest,
    children,
    className: combinedClassNames,
    formMessageId,
    body
  }
}
