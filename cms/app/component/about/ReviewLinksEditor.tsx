"use client";

import { MinusIcon, PlusIcon } from "../icons";
import { SectionCard } from "./SectionCard";
import { StoreLinkEditor } from "./StoreLinkEditor";
import type { AboutData } from "./types";
import { EMPTY_ABOUT_DATA } from "./types";

export function ReviewLinksEditor({
  review,
  onChange,
}: {
  review: AboutData["review"];
  onChange: (next: AboutData["review"]) => void;
}) {
  const safe = review ?? EMPTY_ABOUT_DATA.review!;
  const introLines = safe.introLines ?? [];

  return (
    <SectionCard
      title="Review links"
      description="Copy + the App Store / Google Play review URLs."
      actions={
        <button
          type="button"
          onClick={() => onChange({ ...safe, introLines: [...introLines, ""] })}
          className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <PlusIcon className="h-3 w-3" />
          Add intro line
        </button>
      }
    >
      <div className="space-y-3">
        {introLines.map((line, idx) => (
          <div key={idx} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Line {idx + 1}</p>
              <button
                type="button"
                onClick={() => onChange({ ...safe, introLines: introLines.filter((_, i) => i !== idx) })}
                className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
              >
                <MinusIcon className="h-3 w-3" />
                Remove
              </button>
            </div>
            <input
              value={line}
              onChange={e =>
                onChange({
                  ...safe,
                  introLines: introLines.map((v, i) => (i === idx ? e.target.value : v)),
                })
              }
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter a sentence…"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <StoreLinkEditor
          title="App Store"
          value={safe.links.appStore}
          onChange={(next) => onChange({ ...safe, links: { ...safe.links, appStore: next } })}
        />
        <StoreLinkEditor
          title="Google Play"
          value={safe.links.googlePlay}
          onChange={(next) => onChange({ ...safe, links: { ...safe.links, googlePlay: next } })}
        />
      </div>
    </SectionCard>
  );
}

