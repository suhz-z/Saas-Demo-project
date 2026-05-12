import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>
      
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, oklch(0.11 0.022 272 / 0.75), oklch(0.09 0.018 275 / 0.65))", border: "1px solid oklch(0.24 0.035 272 / 0.65)" }}>
        <div className="p-4 border-b border-border/40 flex justify-between items-center bg-muted/20">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="p-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-border/20 last:border-0">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
