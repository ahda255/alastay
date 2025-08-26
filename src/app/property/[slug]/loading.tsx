import Skeleton from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="p-4 space-y-4">
      <Skeleton className="h-4 w-40" /> {/* breadcrumb */}
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-40" />
      </div>
      <Skeleton className="h-24 w-full" />
    </main>
  );
}
