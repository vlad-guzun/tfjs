import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 bg-opacity-70">
        <Skeleton className="h-[60px] w-[60px] rounded-full" />
        <Skeleton className="h-3 w-[80px]" />
    </div>
  )
}
