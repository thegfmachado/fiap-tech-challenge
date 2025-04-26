import type { FormProviderProps, FieldValues } from "react-hook-form"

export type FormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues
> = FormProviderProps<TFieldValues, TContext, TTransformedValues>
