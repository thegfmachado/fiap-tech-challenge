
import { FormLabelProps } from "./form-label.types";

import { useFormField } from "../form-field/use-form-field";

import { cn } from "../../../lib/utils";

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
