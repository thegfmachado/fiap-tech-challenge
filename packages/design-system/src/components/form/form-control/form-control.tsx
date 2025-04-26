import { Slot } from "@radix-ui/react-slot"

import { FormControlProps } from "./form-control.types"

import { useFormControl } from "./use-form-control"

function FormControl(props: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId, ...rest } = useFormControl(props);

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={Boolean(error)}
      {...rest}
    />
  )
}

export { FormControl }
