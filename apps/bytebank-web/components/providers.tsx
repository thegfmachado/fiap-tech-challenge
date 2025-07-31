"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AuthProvider } from "@bytebank/contexts/auth-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </NextThemesProvider>
  )
}
