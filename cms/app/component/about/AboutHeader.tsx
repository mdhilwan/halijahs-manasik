"use client";

import { CheckIcon, DownloadIcon } from "../icons";

export function AboutHeader({
  isDirty,
  isSaving,
  successMsg,
  error,
  onDownload,
  onSave,
}: {
  isDirty: boolean;
  isSaving: boolean;
  successMsg: string | null;
  error: string | null;
  onDownload: () => void;
  onSave: () => void;
}) {
  return (
    <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-20 shadow-sm">
      <div className="mx-auto max-w-5xl flex items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">About</h1>
          <p className="text-sm text-muted-foreground">
            Edit the app About landing page content (copy, contributors, links, and footer).
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {isDirty && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                Unsaved changes
              </span>
            )}
            {successMsg && (
              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] font-medium text-green-700 dark:text-green-400">
                {successMsg}
              </span>
            )}
            {error && (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
                {error}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDownload}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <DownloadIcon className="h-4 w-4" />
            Download
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckIcon className="h-4 w-4" />
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </header>
  );
}

