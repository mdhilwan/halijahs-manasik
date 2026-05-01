"use client";

import { MinusIcon, PlusIcon } from "../icons";
import { moveItem } from "./utils";
import { SectionCard } from "./SectionCard";
import type { AboutData, AboutSocialLink } from "./types";

export function SocialLinksEditor({
  footer,
  onChange,
}: {
  footer: AboutData["footer"];
  onChange: (next: AboutData["footer"]) => void;
}) {
  const socialLinks = footer?.socialLinks ?? [];

  function updateLink(idx: number, patch: Partial<AboutSocialLink>) {
    const next = socialLinks.map((v, i) => (i === idx ? { ...v, ...patch } : v));
    onChange({ ...footer, socialLinks: next });
  }

  return (
    <SectionCard
      title="Social links"
      description="The intro copy and the row of icon buttons (Ionicons names)."
      actions={
        <button
          type="button"
          onClick={() => onChange({ ...footer, socialLinks: [...socialLinks, { href: "", icon: "" }] })}
          className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <PlusIcon className="h-3 w-3" />
          Add social link
        </button>
      }
    >
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Intro text</label>
        <textarea
          value={footer?.socialsIntro ?? ""}
          onChange={e => onChange({ ...footer, socialsIntro: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="To explore more tours…"
        />
      </div>

      <div className="mt-4 space-y-3">
        {socialLinks.map((link, idx) => (
          <div key={idx} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-muted-foreground">Link {idx + 1}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ ...footer, socialLinks: moveItem(socialLinks, idx, idx - 1) })}
                  disabled={idx === 0}
                  className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...footer, socialLinks: moveItem(socialLinks, idx, idx + 1) })}
                  disabled={idx === socialLinks.length - 1}
                  className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...footer, socialLinks: socialLinks.filter((_, i) => i !== idx) })}
                  className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <MinusIcon className="h-3 w-3" />
                  Remove
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">URL</label>
                <input
                  value={link.href}
                  onChange={e => updateLink(idx, { href: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://…"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Ionicons name</label>
                <input
                  value={link.icon}
                  onChange={e => updateLink(idx, { icon: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., logo-instagram"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Matches <code className="bg-muted px-1 rounded">@expo/vector-icons/Ionicons</code>.
                </p>
              </div>
            </div>
          </div>
        ))}

        {socialLinks.length === 0 && <p className="text-sm text-muted-foreground">No social links yet.</p>}
      </div>
    </SectionCard>
  );
}

