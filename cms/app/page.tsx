"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { DuaType } from "../../app/types";

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

export default function Home() {
  const [duas, setDuas] = useState<DuaType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [language, setLanguage] = useState<"en" | "my">("en");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDuaTitle, setNewDuaTitle] = useState({ en: "", my: "" });
  const [filterNoAudio, setFilterNoAudio] = useState(false);

  useEffect(() => {
    fetch("/api/duas").then(r => r.json()).then(setDuas);
    fetch("/api/categories").then(r => r.json()).then(setCategories);
  }, []);

  const filteredDuas = useMemo(() => {
    return duas.filter(dua => {
      const title = language === "en" ? dua.titleEn : dua.titleMy;
      const matchesSearch = title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           dua.titleEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dua.titleMy?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Multi-select: dua must have ALL selected categories
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.every(cat => dua.categoryKey?.includes(cat));
      
      // No audio filter
      const matchesNoAudio = !filterNoAudio || !dua.audio;
      
      return matchesSearch && matchesCategory && matchesNoAudio;
    });
  }, [duas, searchQuery, selectedCategories, language, filterNoAudio]);

  function toggleCategory(categoryKey: string, isSubcategory: boolean = false, parentKey?: string) {
    setSelectedCategories(prev => {
      if (prev.includes(categoryKey)) {
        // Deselecting
        if (!isSubcategory) {
          // Deselecting parent: also deselect all its subcategories
          const parent = categories.find(c => c.key === categoryKey);
          const subcatKeys = parent?.subcategories.map(s => s.key) || [];
          return prev.filter(c => c !== categoryKey && !subcatKeys.includes(c));
        }
        return prev.filter(c => c !== categoryKey);
      } else {
        // Selecting - just add the category
        return [...prev, categoryKey];
      }
    });
  }

  function clearAllFilters() {
    setSelectedCategories([]);
    setFilterNoAudio(false);
    setSearchQuery("");
  }

  async function createDua() {
    if (!newDuaTitle.en.trim()) return;
    
    await fetch("/api/duas", {
      method: "POST",
      body: JSON.stringify({
        id: Date.now(),
        titleEn: newDuaTitle.en,
        titleMy: newDuaTitle.my || newDuaTitle.en,
        doa: [],
        categoryKey: [],
        audio: ""
      })
    });
    setNewDuaTitle({ en: "", my: "" });
    setIsAddModalOpen(false);
    fetch("/api/duas").then(r => r.json()).then(setDuas);
  }

  function downloadDuas() {
    const blob = new Blob([JSON.stringify(duas, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "duas.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasActiveFilters = selectedCategories.length > 0 || filterNoAudio || searchQuery;

  return (
    <main className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dua Management</h1>
            <p className="text-sm text-muted-foreground">Manage duas for Haji and Umrah Manasik App</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/categories"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <TagIcon className="h-4 w-4" />
              Categories
            </Link>
            <button
              onClick={downloadDuas}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <DownloadIcon className="h-4 w-4" />
              Download JSON
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Add Dua
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Filters Section */}
        <div className="mb-6 space-y-4">
          {/* Search and Language Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-96">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search duas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div className="flex items-center gap-4">
              {/* No Audio Filter */}
              <button
                onClick={() => setFilterNoAudio(!filterNoAudio)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  filterNoAudio 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <NoAudioIcon className="h-4 w-4" />
                No Audio
              </button>

              {/* Language Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Display:</span>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      language === "en" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card text-foreground hover:bg-secondary"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("my")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      language === "my" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card text-foreground hover:bg-secondary"
                    }`}
                  >
                    Malay
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter - Multi Select with Subcategories */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Filter by Categories</span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categories.map(category => (
                <div key={category.key} className="space-y-1.5 p-2 rounded-lg border border-border bg-card/50">
                  {/* Parent Category */}
                  <button
                    onClick={() => toggleCategory(category.key, false)}
                    className={`w-full rounded-md px-2 py-1.5 text-xs font-medium transition-colors text-left ${
                      selectedCategories.includes(category.key)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {language === "en" ? category.nameEn : category.nameMy}
                    {selectedCategories.includes(category.key) && (
                      <span className="ml-1 float-right">×</span>
                    )}
                  </button>
                  
                  {/* Subcategories */}
                  {category.subcategories.length > 0 && (
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
                          {selectedCategories.includes(sub.key) && (
                            <span className="ml-1 float-right">×</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {selectedCategories.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Showing duas that include ALL selected categories: {selectedCategories.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredDuas.length} of {duas.length} duas
          {selectedCategories.length > 0 && (
            <span> with categories: <span className="font-medium capitalize text-foreground">{selectedCategories.join(", ")}</span></span>
          )}
          {filterNoAudio && <span className="font-medium text-foreground"> (No audio only)</span>}
        </div>

        {/* Duas List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDuas.map(dua => (
            <div
              key={dua.id}
              className="group rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {language === "en" ? dua.titleEn : dua.titleMy}
                  </h3>
                  {language === "en" && dua.titleMy && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{dua.titleMy}</p>
                  )}
                  {language === "my" && dua.titleEn && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{dua.titleEn}</p>
                  )}
                </div>
                <Link
                  href={`/edit/${dua.id}`}
                  className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Edit
                </Link>
              </div>
              
              {dua.categoryKey && dua.categoryKey.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dua.categoryKey.slice(0, 3).map(cat => (
                    <span
                      key={cat}
                      className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize"
                    >
                      {cat}
                    </span>
                  ))}
                  {dua.categoryKey.length > 3 && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      +{dua.categoryKey.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{dua.doa?.length || 0} entries</span>
                {dua.audio ? (
                  <>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1">
                      <AudioIcon className="h-3 w-3" />
                      Has audio
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1 text-destructive/70">
                      <NoAudioIcon className="h-3 w-3" />
                      No audio
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredDuas.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No duas found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">Add New Dua</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Title (English) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={newDuaTitle.en}
                  onChange={e => setNewDuaTitle(prev => ({ ...prev, en: e.target.value }))}
                  placeholder="Enter English title"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Title (Malay)
                </label>
                <input
                  type="text"
                  value={newDuaTitle.my}
                  onChange={e => setNewDuaTitle(prev => ({ ...prev, my: e.target.value }))}
                  placeholder="Enter Malay title"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewDuaTitle({ en: "", my: "" });
                }}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createDua}
                disabled={!newDuaTitle.en.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Dua
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Icons
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function AudioIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
}

function NoAudioIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zm12-6l-6 6m0-6l6 6" />
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
