export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Header Skeleton */}
      <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-20">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 bg-muted rounded-lg" />
            <div className="h-4 w-56 bg-muted rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-36 bg-muted rounded-lg" />
            <div className="h-10 w-32 bg-muted rounded-lg" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-6">
        {/* Stats Skeleton */}
        <div className="mb-6 flex gap-4">
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <div className="h-8 w-8 bg-muted rounded mb-1" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <div className="h-8 w-8 bg-muted rounded mb-1" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        </div>

        {/* Categories List Skeleton */}
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-muted rounded" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-32 bg-muted rounded" />
                      <div className="h-5 w-20 bg-muted rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-4 w-28 bg-muted rounded" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-20 bg-muted rounded-lg" />
                  <div className="h-7 w-20 bg-muted rounded-lg" />
                  <div className="h-7 w-14 bg-muted rounded-lg" />
                  <div className="h-7 w-16 bg-muted rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
