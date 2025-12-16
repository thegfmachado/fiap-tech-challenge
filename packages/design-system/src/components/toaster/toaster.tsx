"use client"

import type { ToasterProps } from "sonner";
import { Toaster as Sonner } from "sonner"

import { useToaster } from "./use-toaster";

export function Toaster(props: ToasterProps) {
  const properties = useToaster(props);

  return (
    <Sonner {...properties} />
  )
}

export { toast } from "sonner";
