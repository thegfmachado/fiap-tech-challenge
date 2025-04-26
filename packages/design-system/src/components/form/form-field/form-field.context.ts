import * as React from "react"
import { FormFieldContextValue } from "./form-field.types"

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

export { FormFieldContext }
