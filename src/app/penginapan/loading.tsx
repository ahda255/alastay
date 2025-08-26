import Skeleton from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="py-6 space-y-6">
      <Skeleton className="h-7 w-56" /> {/* judul */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-3">
            <Skeleton className="h-40 w-full rounded" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
