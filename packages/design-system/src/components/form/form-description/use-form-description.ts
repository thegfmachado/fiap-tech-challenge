
import { FormDescriptionProps } from "./form-description.types";

import { useFormField } from "../form-field/use-form-field";

import { cn } from "@fiap-tech-challenge/design-system/lib/utils";

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
