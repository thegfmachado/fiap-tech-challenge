import * as React from 'react';

export function Root({ children }: React.PropsWithChildren) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-100">
      {children}
    </div>
  )
}
