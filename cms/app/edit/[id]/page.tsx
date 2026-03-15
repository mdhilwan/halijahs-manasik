"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Scheherazade_New } from 'next/font/google';
import DoaPreview from "../../component/doa-preview";
import { DuaType } from "../../../../app/types";

interface Subcategory {
  key: string;
  nameEn: string;
  nameMy: string;
}

interface Category {
  key: string;
  nameEn: string;
  nameMy: string;
  global?: boolean;
  subcategories: Subcategory[];
}

const scheherazadeNew = Scheherazade_New({
  weight: "400",
  subsets: ["arabic"]
})

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [dua, setDua] = useState<DuaType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [language, setLanguage] = useState<"en" | "my">("en");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/duas").then(r => r.json()).then((data) => {
      const foundDua = data.find((d: any) => String(d.id) === id) as DuaType;
      setDua(foundDua);
      setSelectedCategories(foundDua?.categoryKey ?? []);
    });
    fetch("/api/categories").then(r => r.json()).then(setCategories);
  }, [id]);

  const canSave = selectedCategories.length > 0;

  if (!dua) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    );
  }

  async function save() {
    if (!canSave) return;
    setIsSaving(true);
    await fetch("/api/duas", {
      method: "PUT",
      body: JSON.stringify(dua)
    });
    setIsSaving(false);
    router.push("/");
  }

  async function remove() {
    if (!confirm("Are you sure you want to delete this dua?")) return;
    await fetch("/api/duas", {
      method: "DELETE",
      body: JSON.stringify({ id: dua.id })
    });
    router.push("/");
  }

  function toggleCategory(categoryKey: string, isSubcategory: boolean = false, parentKey?: string) {
    let newSelectedCategories: string[];
    
    if (selectedCategories.includes(categoryKey)) {
      // Deselecting
      if (!isSubcategory) {
        // Deselecting parent: also deselect all its subcategories
        const parent = categories.find(c => c.key === categoryKey);
        const subcatKeys = parent?.subcategories.map(s => s.key) || [];
        newSelectedCategories = selectedCategories.filter(c => c !== categoryKey && !subcatKeys.includes(c));
      } else {
        newSelectedCategories = selectedCategories.filter(c => c !== categoryKey);
      }
    } else {
      // Selecting
      if (isSubcategory && parentKey) {
        // Selecting subcategory: auto-add parent if not already selected
        if (!selectedCategories.includes(parentKey)) {
          newSelectedCategories = [...selectedCategories, parentKey, categoryKey];
        } else {
          newSelectedCategories = [...selectedCategories, categoryKey];
        }
      } else {
        newSelectedCategories = [...selectedCategories, categoryKey];
      }
    }
    
    setSelectedCategories(newSelectedCategories);
    setDua({ ...dua, categoryKey: newSelectedCategories });
  }

  function toggleExpanded(categoryKey: string) {
    setExpandedCategories(prev =>
      prev.includes(categoryKey)
        ? prev.filter(k => k !== categoryKey)
        : [...prev, categoryKey]
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">Edit Dua</h1>
              <p className="text-xs text-muted-foreground">ID: {dua.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={remove}
              className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </button>
            <div className="relative group">
              <button
                onClick={save}
                disabled={isSaving || !canSave}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SaveIcon className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              {!canSave && (
                <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  Please select at least one category to save
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex gap-8">
          {/* Form Section */}
          <div className="flex-1 space-y-6 max-w-2xl">
            {/* Basic Info Card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <InfoIcon className="h-5 w-5 text-muted-foreground" />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Title (English)
                  </label>
                  <input
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={dua.titleEn}
                    onChange={e => setDua({ ...dua, titleEn: e.target.value })}
                    placeholder="Enter English title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Title (Malay)
                  </label>
                  <input
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={dua.titleMy}
                    onChange={e => setDua({ ...dua, titleMy: e.target.value })}
                    placeholder="Enter Malay title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Audio Filename
                  </label>
                  <input
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={dua.audio ?? ""}
                    onChange={e => setDua({ ...dua, audio: e.target.value })}
                    placeholder="e.g., dua-01.mp3"
                  />
                </div>
              </div>
            </div>

            {/* Categories Card */}
            <div className={`rounded-xl border bg-card p-6 ${!canSave ? 'border-destructive/50' : 'border-border'}`}>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <TagIcon className="h-5 w-5 text-muted-foreground" />
                  Categories
                  <span className="text-destructive text-sm">*</span>
                </h2>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      language === "en" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card text-foreground hover:bg-secondary"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage("my")}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      language === "my" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card text-foreground hover:bg-secondary"
                    }`}
                  >
                    MY
                  </button>
                </div>
              </div>
              {!canSave && (
                <p className="text-xs text-destructive mb-3">At least one category is required</p>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categories.map(category => (
                  <div key={category.key} className="space-y-1.5 p-2 rounded-lg border border-border bg-card/50">
                    {/* Parent Category */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleCategory(category.key, false)}
                        className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors text-left ${
                          selectedCategories.includes(category.key)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {language === "en" ? category.nameEn : category.nameMy}
                      </button>
                      {category.subcategories.length > 0 && (
                        <button
                          onClick={() => toggleExpanded(category.key)}
                          className="shrink-0 p-1 rounded hover:bg-secondary transition-colors"
                          aria-label={expandedCategories.includes(category.key) ? "Collapse subcategories" : "Expand subcategories"}
                        >
                          <ChevronIcon 
                            className={`h-4 w-4 text-muted-foreground transition-transform ${
                              expandedCategories.includes(category.key) ? "rotate-180" : ""
                            }`} 
                          />
                        </button>
                      )}
                    </div>
                    
                    {/* Subcategories - Collapsible */}
                    {category.subcategories.length > 0 && expandedCategories.includes(category.key) && (
                      <div className="flex flex-col gap-1 pl-2 border-l-2 border-border">
                        {category.subcategories.map(sub => (
                          <button
                            key={sub.key}
                            onClick={() => toggleCategory(sub.key, true, category.key)}
                            className={`w-full rounded-md px-2 py-1 text-[11px] font-medium transition-colors text-left ${
                              selectedCategories.includes(sub.key)
                                ? "bg-primary/80 text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {language === "en" ? sub.nameEn : sub.nameMy}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {selectedCategories.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {selectedCategories.length} {selectedCategories.length === 1 ? "category" : "categories"} selected
                </p>
              )}
            </div>

            {/* Doa Entries Card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <BookIcon className="h-5 w-5 text-muted-foreground" />
                  Doa Entries
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const doaList = [
                      ...dua.doa,
                      {
                        id: Date.now(),
                        arabic: "",
                        translationEn: "",
                        translationMy: ""
                      }
                    ];
                    setDua({ ...dua, doa: doaList });
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Add Entry
                </button>
              </div>

              {dua.doa.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No doa entries yet</p>
                  <p className="text-xs mt-1">Click &#34;Add Entry&#34; to create one</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dua.doa.map((d: any, index: number) => (
                    <div
                      key={d.id}
                      className="rounded-lg border border-border bg-background p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          Entry #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const doaList = dua.doa.filter((_: any, i: number) => i !== index);
                            setDua({ ...dua, doa: doaList });
                          }}
                          className="text-xs text-destructive hover:text-destructive/80 font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Arabic Text
                        </label>
                        <textarea
                          className={`${scheherazadeNew.className} w-full rounded-lg border border-input bg-card px-3 py-2.5 text-lg leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-right`}
                          dir="rtl"
                          rows={4}
                          value={d.arabic}
                          onChange={e => {
                            const doaList = [...dua.doa];
                            doaList[index] = { ...doaList[index], arabic: e.target.value };
                            setDua({ ...dua, doa: doaList });
                          }}
                          placeholder="Enter Arabic text..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Translation (English)
                        </label>
                        <textarea
                          className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={3}
                          value={d.translationEn}
                          onChange={e => {
                            const doaList = [...dua.doa];
                            doaList[index] = { ...doaList[index], translationEn: e.target.value };
                            setDua({ ...dua, doa: doaList });
                          }}
                          placeholder="Enter English translation..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Translation (Malay)
                        </label>
                        <textarea
                          className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={3}
                          value={d.translationMy}
                          onChange={e => {
                            const doaList = [...dua.doa];
                            doaList[index] = { ...doaList[index], translationMy: e.target.value };
                            setDua({ ...dua, doa: doaList });
                          }}
                          placeholder="Enter Malay translation..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="mb-4 text-center">
                <h3 className="text-sm font-medium text-foreground">App Preview</h3>
                <p className="text-xs text-muted-foreground">See how it looks in the app</p>
              </div>
              <DoaPreview {...dua} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
