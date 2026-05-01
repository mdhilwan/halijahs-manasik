"use client";

export default function AudioLibraryPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold text-foreground">Audio Library</h1>
          <p className="text-sm text-muted-foreground">
            Browse and listen to all audio files bundled with the app.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Coming soon.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Planned: searchable list of mp3 files from <code className="bg-muted px-1 rounded">assets/audio</code> with a simple player.
          </p>
        </div>
      </div>
    </div>
  );
}

