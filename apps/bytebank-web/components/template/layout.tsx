"use client"

import { PropsWithChildren } from "react";

export function Layout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="h-screen grid grid-cols-1 grid-rows-[64px_1fr] md:grid-cols-[228px_1fr]">{children}</div>
  );
}
