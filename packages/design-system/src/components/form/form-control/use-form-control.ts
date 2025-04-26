
import { FormControlProps } from "./form-control.types"

import { useFormField } from "../form-field/use-form-field";

export function useFormControl(props: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return {
    ...props,
    error,
    formItemId,
    formMessageId,
    formDescriptionId,
  }
}
