import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-border/60 shadow-sm bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </div>
  );
}
