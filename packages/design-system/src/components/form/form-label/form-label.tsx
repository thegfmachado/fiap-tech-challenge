import { Label } from "../../label/label"
import { FormLabelProps } from "./form-label.types"
import { useFormLabel } from "./use-form-label";

function FormLabel(props: FormLabelProps) {
  const { className, error, formItemId } = useFormLabel(props);

  return (
    <Label
      data-slot="form-label"
      data-error={Boolean(error)}
      className={className}
      htmlFor={formItemId}
      {...props}
    />
  )
}

export { FormLabel }
