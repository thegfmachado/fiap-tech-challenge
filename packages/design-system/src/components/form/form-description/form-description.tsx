import type { FormDescriptionProps } from "./form-description.types";
import { useFormDescription } from "./use-form-description";

function FormDescription(props: FormDescriptionProps) {
  const { className, formDescriptionId, ...rest } = useFormDescription(props);

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={className}
      {...rest}
    />
  )
}

export { FormDescription }
