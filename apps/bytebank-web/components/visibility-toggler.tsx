import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface VisibilityTogglerProps {
  show: boolean;
  onClick: () => void;
}

export function VisibilityToggler(props: VisibilityTogglerProps) {
  return (
    <span className="cursor-pointer" onClick={props.onClick}>
      {props.show ? <EyeIcon size={46}/> : <EyeOffIcon size={46}/>}
    </span>
  )
}
