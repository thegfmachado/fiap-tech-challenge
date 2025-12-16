import { useTheme } from "next-themes";
import type React from "react";
import type { ToasterProps } from "sonner";

import { cn } from "../../lib/utils";

export function useToaster(props: ToasterProps): ToasterProps {
  const { theme = "system" } = useTheme();

  const className = cn("toaster group", props.className);

  const style = {
    "--normal-bg": "var(--popover)",
    "--normal-text": "var(--popover-foreground)",
    "--normal-border": "var(--border)",
  } as React.CSSProperties;

  const toasterTheme = props.theme ?? (theme as ToasterProps["theme"]);

  return {
    ...props,
    className,
    style,
    theme: toasterTheme,
  }
}
