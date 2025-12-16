"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

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
