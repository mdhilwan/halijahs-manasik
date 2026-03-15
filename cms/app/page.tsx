"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { DuaType } from "../../app/types";

const categoryOptions = [
  "arafah", "mina", "muzdalifah", "stoning", "talbiyah", "ihram", "umrah", "haji", 
  "masjidil haram", "tawaf", "niat", "zam-zam", "sa'i", "tahalul", "tawaf wadak", "madinah", "travel"
];

export default function Home() {
  const [duas, setDuas] = useState<DuaType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "my">("en");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDuaTitle, setNewDuaTitle] = useState({ en: "", my: "" });

  useEffect(() => {
    fetch("/api/duas").then(r => r.json()).then(setDuas);
  }, []);

  const filteredDuas = useMemo(() => {
    return duas.filter(dua => {
      const title = language === "en" ? dua.titleEn : dua.titleMy;
      const matchesSearch = title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           dua.titleEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dua.titleMy?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || dua.categoryKey?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [duas, searchQuery, selectedCategory, language]);

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

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dua Management</h1>
            <p className="text-sm text-muted-foreground">Manage duas for Haji and Umrah Manasik App</p>
          </div>
          <div className="flex items-center gap-3">
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

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All Categories
            </button>
            {categoryOptions.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredDuas.length} of {duas.length} duas
          {selectedCategory && <span> in <span className="font-medium capitalize text-foreground">{selectedCategory}</span></span>}
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
                {dua.audio && (
                  <>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1">
                      <AudioIcon className="h-3 w-3" />
                      Has audio
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
