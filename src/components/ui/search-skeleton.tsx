import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function SearchSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-end">
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-12 space-y-4">
        <Skeleton className="h-6 w-48" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
