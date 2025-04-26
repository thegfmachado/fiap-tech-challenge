import { Geist, Geist_Mono } from "next/font/google"

import { Toaster } from "@fiap-tech-challenge/design-system/components";

import { Providers } from "@/components/providers"

import "@fiap-tech-challenge/design-system/globals.css"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
