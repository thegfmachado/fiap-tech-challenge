import * as React from "react"
import { Eye, EyeOff } from "lucide-react";

import type { InputProps } from "./input.types";
import { useInput } from "./use-input";

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps
>((props, ref) => {
  const {
    className,
    isPassword,
    showPasswordToggle = true,
    handleSetVisible,
    visible,
    type,
    ...otherProps
  } = useInput(props);

  return (
    <div className="relative w-full">
      <input
        {...otherProps}
        type={type}
        className={className}
        ref={ref}
      />
      {isPassword && showPasswordToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground cursor-pointer"
          onClick={handleSetVisible}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
