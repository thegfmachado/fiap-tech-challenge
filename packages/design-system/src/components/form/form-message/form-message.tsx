import type { FormMessageProps } from "./form-message.types"
import { useFormMessage } from "./use-form-message"

function FormMessage(props: FormMessageProps) {
  const { className, formMessageId, body } = useFormMessage(props)

  return body ? (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={className}
      {...props}
    >
      {body}
    </p>
  ) : null
}

export { FormMessage }
