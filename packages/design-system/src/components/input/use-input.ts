import * as React from "react";

import type { InputProps } from "./input.types";
import { cn } from "../../lib/utils";

export function useInput(props: InputProps) {
  const { className, type, showPasswordToggle = true } = props;
  const [visible, setVisible] = React.useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPasswordToggle ? (visible ? "text" : "password") : type;

  const combinedClassName = cn(
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    className
  );

  const handleSetVisible = () => {
    setVisible(!visible);
  };

  return {
    ...props,
    className: combinedClassName,
    isPassword,
    type: inputType,
    visible,
    handleSetVisible,
  }
}
