import { Slot } from "@radix-ui/react-slot"

import type { FormControlProps } from "./form-control.types"
import { useFormControl } from "./use-form-control"

function FormControl(props: FormControlProps) {
  const { ariaDescribedBy, ariaInvalid, formItemId, ...rest } = useFormControl(props);

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      {...rest}
    />
  )
}

export { FormControl }
