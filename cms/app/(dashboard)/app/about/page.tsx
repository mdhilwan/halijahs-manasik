"use client";

export default function AboutManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold text-foreground">About</h1>
          <p className="text-sm text-muted-foreground">
            Edit the app About landing page content (copy, contributors, links, and footer).
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Coming soon.
          </p>
          <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>About the app</li>
            <li>Contributors</li>
            <li>Social media links</li>
            <li>Review links (App Store / Google Play)</li>
            <li>Contact email</li>
            <li>Terms &amp; Conditions footer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

