"use client";

import { MinusIcon, PlusIcon } from "../icons";
import { moveItem } from "./utils";
import { SectionCard } from "./SectionCard";
import type { AboutContributor } from "./types";

export function ContributorsEditor({
  contributors,
  onChange,
}: {
  contributors: AboutContributor[];
  onChange: (next: AboutContributor[]) => void;
}) {
  const list = contributors ?? [];

  return (
    <SectionCard
      title="Contributors"
      description="Each contributor has a name and short description."
      actions={
        <button
          type="button"
          onClick={() => onChange([...(list ?? []), { name: "", description: "" }])}
          className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <PlusIcon className="h-3 w-3" />
          Add contributor
        </button>
      }
    >
      <div className="space-y-3">
        {list.map((c, idx) => (
          <div key={idx} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-muted-foreground">Contributor {idx + 1}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange(moveItem(list, idx, idx - 1))}
                  disabled={idx === 0}
                  className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => onChange(moveItem(list, idx, idx + 1))}
                  disabled={idx === list.length - 1}
                  className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => onChange(list.filter((_, i) => i !== idx))}
                  className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <MinusIcon className="h-3 w-3" />
                  Remove
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                <input
                  value={c.name}
                  onChange={e =>
                    onChange(list.map((v, i) => (i === idx ? { ...v, name: e.target.value } : v)))
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Ustaz …"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  value={c.description}
                  onChange={e =>
                    onChange(
                      list.map((v, i) => (i === idx ? { ...v, description: e.target.value } : v))
                    )
                  }
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="What did they contribute?"
                />
              </div>
            </div>
          </div>
        ))}

        {list.length === 0 && <p className="text-sm text-muted-foreground">No contributors yet.</p>}
      </div>
    </SectionCard>
  );
}

