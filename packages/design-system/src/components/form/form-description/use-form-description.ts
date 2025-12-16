import type { FormDescriptionProps } from "./form-description.types";
import { cn } from "../../../lib/utils";
import { useFormField } from "../form-field/use-form-field";

export function useFormDescription(props: FormDescriptionProps) {
  const { className, ...rest } = props;
  const { formDescriptionId } = useFormField();

  const combinedClassNames = cn("text-muted-foreground text-sm", className);

  return {
    ...rest,
    className: combinedClassNames,
    formDescriptionId,
  }
}
