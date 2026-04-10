export default function AppLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Header Skeleton */}
      <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-20">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-muted rounded-lg" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-muted rounded-lg" />
            <div className="h-10 w-28 bg-muted rounded-lg" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Filters Skeleton */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-64 bg-muted rounded-lg" />
            <div className="h-10 w-40 bg-muted rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 bg-muted rounded-full" />
            <div className="h-8 w-24 bg-muted rounded-full" />
            <div className="h-8 w-28 bg-muted rounded-full" />
          </div>
        </div>

        {/* List Skeleton */}
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-5 w-5 bg-muted rounded mt-1" />
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-muted rounded" />
                    <div className="h-4 w-72 bg-muted rounded" />
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-5 w-16 bg-muted rounded-full" />
                      <div className="h-5 w-20 bg-muted rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-16 bg-muted rounded-lg" />
                  <div className="h-8 w-16 bg-muted rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
