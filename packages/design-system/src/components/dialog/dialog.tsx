"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { DialogOverlay } from "./dialog-overlay/dialog-overlay"
import { DialogContent } from "./dialog-content/dialog-content"
import { DialogHeader } from "./dialog-header/dialog-header"
import { DialogFooter } from "./dialog-footer/dialog-footer"
import { DialogTitle } from "./dialog-title/dialog-title"
import { DialogDescription } from "./dialog-description/dialog-description"

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
