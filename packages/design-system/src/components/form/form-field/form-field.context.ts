import * as React from "react"

import type { FormFieldContextValue } from "./form-field.types"

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

export { FormFieldContext }
