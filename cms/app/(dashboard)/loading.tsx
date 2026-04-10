export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Header Skeleton */}
      <header className="border-b border-border bg-card px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="h-9 w-40 bg-muted rounded-lg" />
          <div className="mt-2 h-5 w-72 bg-muted rounded" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Stats Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-10 w-20 bg-muted rounded" />
                </div>
                <div className="h-12 w-12 bg-muted rounded-lg" />
              </div>
              <div className="mt-4 h-4 w-32 bg-muted rounded" />
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mt-10">
          <div className="h-6 w-32 bg-muted rounded mb-4" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="h-10 w-10 bg-muted rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
