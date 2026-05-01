"use client";

import { SectionCard } from "./SectionCard";

export function CopyrightEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <SectionCard
      title="Copyright / Terms footer"
      description="Small-print footer text shown at the end of the About page."
    >
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="© 2026 …"
      />
    </SectionCard>
  );
}

