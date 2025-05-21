"use client"

import { PropsWithChildren } from "react";

export function Main(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="flex flex-col items-center grow overflow-auto md:row-start-2 md:col-start-2">{children}</div>
  );
}
