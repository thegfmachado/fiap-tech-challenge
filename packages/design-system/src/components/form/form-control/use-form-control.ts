import type { FormControlProps } from "./form-control.types"
import { useFormField } from "../form-field/use-form-field";

export function useFormControl(props: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  const ariaInvalid = Boolean(error);

  const ariaDescribedBy = !error
    ? `${formDescriptionId}`
    : `${formDescriptionId} ${formMessageId}`;

  return {
    ...props,
    ariaInvalid,
    ariaDescribedBy,
    error,
    formItemId,
  }
}
