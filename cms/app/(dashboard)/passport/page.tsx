export default function PassportPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-6">
          <PassportIcon className="mx-auto h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-foreground">Passport</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}

function PassportIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
      <circle cx="12" cy="10" r="3" />
      <path d="M8 17h8" />
    </svg>
  )
}
