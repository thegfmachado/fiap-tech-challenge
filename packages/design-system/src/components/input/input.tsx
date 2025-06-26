import * as React from "react"
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@fiap-tech-challenge/design-system/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { showPasswordToggle?: boolean }
>(({ className, type, showPasswordToggle = false, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPasswordToggle ? (visible ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
      {isPassword && showPasswordToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground cursor-pointer"
          onClick={() => setVisible(!visible)}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
