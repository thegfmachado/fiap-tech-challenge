import type { ButtonProps } from "./button.types"
import { useButton } from "./use-button"

export { buttonVariants } from "./use-button"

export function Button(props: ButtonProps) {
  const { Comp, ...rest } = useButton(props)

  return <Comp {...rest} data-slot="button" />
}
