import { Skeleton } from "@fiap-tech-challenge/design-system/components";

export function TransactionSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-10 w-full">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center p-4 border rounded-md w-full gap-4 flex-wrap"
        >
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <Skeleton className="h-4 w-full max-w-xs" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-5" />
          </div>
        </div>
      ))}
    </div>
  )
}
