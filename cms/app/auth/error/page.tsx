import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Authentication Error
            </h1>
          </div>
          <div className="mb-6">
            {params?.error ? (
              <p className="text-center text-sm text-muted-foreground">
                Error: {params.error}
              </p>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                An unspecified error occurred during authentication.
              </p>
            )}
          </div>
          <Link
            href="/auth/login"
            className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  )
}
