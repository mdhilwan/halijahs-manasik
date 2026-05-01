"use client";

import type { AboutStoreLink } from "./types";

export function StoreLinkEditor({
  title,
  value,
  onChange,
}: {
  title: string;
  value: AboutStoreLink;
  onChange: (next: AboutStoreLink) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Button label</label>
          <input
            value={value.label}
            onChange={e => onChange({ ...value, label: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={`Review on ${title}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">URL</label>
          <input
            value={value.href}
            onChange={e => onChange({ ...value, href: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="https://…"
          />
        </div>
      </div>
    </div>
  );
}

