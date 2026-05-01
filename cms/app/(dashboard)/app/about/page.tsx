"use client";

import { useEffect, useMemo, useState } from "react";
import { AboutHeader } from "../../../component/about/AboutHeader";
import { AboutCopyEditor } from "../../../component/about/AboutCopyEditor";
import { ContributorsEditor } from "../../../component/about/ContributorsEditor";
import { SocialLinksEditor } from "../../../component/about/SocialLinksEditor";
import { ReviewLinksEditor } from "../../../component/about/ReviewLinksEditor";
import { GetInTouchEditor } from "../../../component/about/GetInTouchEditor";
import { CopyrightEditor } from "../../../component/about/CopyrightEditor";
import { downloadJson } from "../../../component/about/utils";
import { EMPTY_ABOUT_DATA, type AboutData } from "../../../component/about/types";

export default function AboutManagementPage() {
  const [data, setData] = useState<AboutData>(EMPTY_ABOUT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [initialSnapshot, setInitialSnapshot] = useState<string>(JSON.stringify(EMPTY_ABOUT_DATA));
  const isDirty = useMemo(() => JSON.stringify(data) !== initialSnapshot, [data, initialSnapshot]);

  useEffect(() => {
    fetchAbout();
  }, []);

  async function fetchAbout() {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/about", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load about.json (${res.status})`);
      const json = (await res.json()) as AboutData;
      const nextData: AboutData = {
        ...EMPTY_ABOUT_DATA,
        ...json,
        footer: {
          ...EMPTY_ABOUT_DATA.footer,
          ...(json.footer ?? {}),
        },
        getInTouch: json.getInTouch ?? EMPTY_ABOUT_DATA.getInTouch,
        review: json.review ?? EMPTY_ABOUT_DATA.review,
      };
      setData(nextData);
      setInitialSnapshot(JSON.stringify(nextData));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load about.json");
    } finally {
      setIsLoading(false);
    }
  }

  async function save() {
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const message = await res.json().catch(() => ({}));
        throw new Error(message?.error ?? `Failed to save (${res.status})`);
      }
      setInitialSnapshot(JSON.stringify(data));
      setSuccessMsg("Saved to assets/data/about.json");
      window.setTimeout(() => setSuccessMsg(null), 2500);
    } catch (e: any) {
      setError(e?.message ?? "Failed to save about.json");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AboutHeader
        isDirty={isDirty}
        isSaving={isSaving}
        successMsg={successMsg}
        error={error}
        onDownload={() => downloadJson("about.json", data)}
        onSave={save}
      />

      <div className="mx-auto max-w-5xl px-6 py-6">
        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Loading about.json…</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AboutCopyEditor
              paragraphs={data.about}
              onChange={(about) => setData(prev => ({ ...prev, about }))}
            />

            <ContributorsEditor
              contributors={data.contributors}
              onChange={(contributors) => setData(prev => ({ ...prev, contributors }))}
            />

            <SocialLinksEditor
              footer={data.footer}
              onChange={(footer) => setData(prev => ({ ...prev, footer }))}
            />

            <ReviewLinksEditor
              review={data.review}
              onChange={(review) => setData(prev => ({ ...prev, review }))}
            />

            <GetInTouchEditor
              getInTouch={data.getInTouch}
              onChange={(getInTouch) => setData(prev => ({ ...prev, getInTouch }))}
            />

            <CopyrightEditor
              value={data.copyrightFooter ?? ""}
              onChange={(copyrightFooter) => setData(prev => ({ ...prev, copyrightFooter }))}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={fetchAbout}
                disabled={isSaving}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset to file
              </button>
              <button
                type="button"
                onClick={save}
                disabled={isSaving || !isDirty}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

