"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import type * as React from "react"

import { DialogContent } from "./dialog-content/dialog-content"
import { DialogDescription } from "./dialog-description/dialog-description"
import { DialogFooter } from "./dialog-footer/dialog-footer"
import { DialogHeader } from "./dialog-header/dialog-header"
import { DialogOverlay } from "./dialog-overlay/dialog-overlay"
import { DialogTitle } from "./dialog-title/dialog-title"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

export type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>
