"use client";

import type { AboutData } from "./types";
import { EMPTY_ABOUT_DATA } from "./types";
import { SectionCard } from "./SectionCard";

export function GetInTouchEditor({
  getInTouch,
  onChange,
}: {
  getInTouch: AboutData["getInTouch"];
  onChange: (next: AboutData["getInTouch"]) => void;
}) {
  const safe = getInTouch ?? EMPTY_ABOUT_DATA.getInTouch!;

  return (
    <SectionCard
      title="Get in touch"
      description="Optional: email contact shown at the end of the About page."
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Intro</label>
          <textarea
            value={safe.intro}
            onChange={e => onChange({ ...safe, intro: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
            <input
              value={safe.emailAddress}
              onChange={e => onChange({ ...safe, emailAddress: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="mailto:app@…"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Use a <code className="bg-muted px-1 rounded">mailto:</code> URL.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email button text</label>
            <input
              value={safe.emailText}
              onChange={e => onChange({ ...safe, emailText: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Email us at …"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

