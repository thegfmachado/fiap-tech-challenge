import type { FormLabelProps } from "./form-label.types";
import { cn } from "../../../lib/utils";
import { useFormField } from "../form-field/use-form-field";

export function useFormLabel(props: FormLabelProps) {
  const { className, ...rest } = props;
  const { error, formItemId } = useFormField();

  const combinedClassNames = cn("data-[error=true]:text-destructive", className);

  return {
    ...rest,
    className: combinedClassNames,
    error,
    formItemId,
  }
}
