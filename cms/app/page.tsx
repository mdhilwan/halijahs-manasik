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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  // Bulk edit state
  const [selectedDuaIds, setSelectedDuaIds] = useState<number[]>([]);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchMode, setBatchMode] = useState<"add" | "remove">("add");
  const [batchCategorySelections, setBatchCategorySelections] = useState<string[]>([]);
  const [batchExpandedCategories, setBatchExpandedCategories] = useState<string[]>([]);
  const [isBatchLoading, setIsBatchLoading] = useState(false);

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
                             selectedCategories.some(cat => dua.categoryKey?.includes(cat));
      
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

  function toggleExpanded(categoryKey: string) {
    setExpandedCategories(prev =>
      prev.includes(categoryKey)
        ? prev.filter(k => k !== categoryKey)
        : [...prev, categoryKey]
    );
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

  // Bulk edit functions
  function toggleDuaSelection(duaId: number) {
    setSelectedDuaIds(prev => 
      prev.includes(duaId) 
        ? prev.filter(id => id !== duaId)
        : [...prev, duaId]
    );
  }

  function clearDuaSelection() {
    setSelectedDuaIds([]);
  }

  function openBatchModal(mode: "add" | "remove") {
    setBatchMode(mode);
    setBatchCategorySelections([]);
    setBatchExpandedCategories([]);
    setIsBatchModalOpen(true);
  }

  function toggleBatchCategory(categoryKey: string) {
    setBatchCategorySelections(prev =>
      prev.includes(categoryKey)
        ? prev.filter(k => k !== categoryKey)
        : [...prev, categoryKey]
    );
  }

  function toggleBatchExpanded(categoryKey: string) {
    setBatchExpandedCategories(prev =>
      prev.includes(categoryKey)
        ? prev.filter(k => k !== categoryKey)
        : [...prev, categoryKey]
    );
  }

  async function applyBatchUpdate() {
    if (selectedDuaIds.length === 0 || batchCategorySelections.length === 0) return;
    
    setIsBatchLoading(true);
    try {
      await fetch("/api/duas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedDuaIds,
          categoryKeys: batchCategorySelections,
          mode: batchMode
        })
      });
      
      // Refresh data
      const updatedDuas = await fetch("/api/duas").then(r => r.json());
      setDuas(updatedDuas);
      
      // Reset state
      setIsBatchModalOpen(false);
      setBatchCategorySelections([]);
      setSelectedDuaIds([]);
    } finally {
      setIsBatchLoading(false);
    }
  }

  function selectAllVisible() {
    const visibleIds = filteredDuas.map(d => d.id);
    setSelectedDuaIds(prev => {
      const allSelected = visibleIds.every(id => prev.includes(id));
      if (allSelected) {
        // Deselect all visible
        return prev.filter(id => !visibleIds.includes(id));
      } else {
        // Select all visible
        return [...new Set([...prev, ...visibleIds])];
      }
    });
  }

  const allVisibleSelected = filteredDuas.length > 0 && filteredDuas.every(d => selectedDuaIds.includes(d.id));

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
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
              >
                <ChevronIcon 
                  className={`h-4 w-4 transition-transform ${isFilterExpanded ? "rotate-180" : ""}`} 
                />
                Filter by Categories
                {selectedCategories.length > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    {selectedCategories.length}
                  </span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
            {isFilterExpanded && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                      {selectedCategories.includes(category.key) && (
                        <span className="ml-1 float-right">×</span>
                      )}
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
            )}
            {selectedCategories.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Showing duas that include ALL selected categories: {selectedCategories.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredDuas.length} of {duas.length} duas
            {selectedCategories.length > 0 && (
              <span> with categories: <span className="font-medium capitalize text-foreground">{selectedCategories.join(", ")}</span></span>
            )}
            {filterNoAudio && <span className="font-medium text-foreground"> (No audio only)</span>}
          </div>
          <button
            onClick={selectAllVisible}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <CheckboxIcon checked={allVisibleSelected} />
            {allVisibleSelected ? "Deselect All" : "Select All"}
          </button>
        </div>

        {/* Duas List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
          {filteredDuas.map(dua => {
            const isSelected = selectedDuaIds.includes(dua.id);
            return (
              <div
                key={dua.id}
                onClick={() => toggleDuaSelection(dua.id)}
                className={`group rounded-xl border p-4 transition-all cursor-pointer ${
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20" 
                    : "border-border bg-card hover:shadow-md hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Selection indicator */}
                    <div className={`shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected 
                        ? "bg-primary border-primary" 
                        : "border-muted-foreground/30"
                    }`}>
                      {isSelected && (
                        <CheckIcon className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
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
                  </div>
                  <Link
                    href={`/edit/${dua.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Edit
                  </Link>
                </div>
                
                {dua.categoryKey && dua.categoryKey.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 ml-8">
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
                
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground ml-8">
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
            );
          })}
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

      {/* Batch Edit Sticky Toolbar */}
      {selectedDuaIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg">
          <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {selectedDuaIds.length} selected
              </span>
              <button
                onClick={clearDuaSelection}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openBatchModal("add")}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Add Categories
              </button>
              <button
                onClick={() => openBatchModal("remove")}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <MinusIcon className="h-4 w-4" />
                Remove Categories
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Category Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {batchMode === "add" ? "Add Categories" : "Remove Categories"} 
                <span className="text-muted-foreground font-normal ml-2">
                  ({selectedDuaIds.length} duas)
                </span>
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
            
            <p className="text-sm text-muted-foreground mb-4">
              {batchMode === "add" 
                ? "Select categories to add to the selected duas. Existing categories will be preserved."
                : "Select categories to remove from the selected duas."}
            </p>
            
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map(category => (
                  <div key={category.key} className="space-y-1.5 p-2 rounded-lg border border-border bg-card/50">
                    {/* Parent Category */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleBatchCategory(category.key)}
                        className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors text-left flex items-center gap-2 ${
                          batchCategorySelections.includes(category.key)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        <CheckboxIcon checked={batchCategorySelections.includes(category.key)} small />
                        {language === "en" ? category.nameEn : category.nameMy}
                      </button>
                      {category.subcategories.length > 0 && (
                        <button
                          onClick={() => toggleBatchExpanded(category.key)}
                          className="shrink-0 p-1 rounded hover:bg-secondary transition-colors"
                        >
                          <ChevronIcon 
                            className={`h-4 w-4 text-muted-foreground transition-transform ${
                              batchExpandedCategories.includes(category.key) ? "rotate-180" : ""
                            }`} 
                          />
                        </button>
                      )}
                    </div>
                    
                    {/* Subcategories */}
                    {category.subcategories.length > 0 && batchExpandedCategories.includes(category.key) && (
                      <div className="flex flex-col gap-1 pl-2 border-l-2 border-border">
                        {category.subcategories.map(sub => (
                          <button
                            key={sub.key}
                            onClick={() => toggleBatchCategory(sub.key)}
                            className={`w-full rounded-md px-2 py-1 text-[11px] font-medium transition-colors text-left flex items-center gap-2 ${
                              batchCategorySelections.includes(sub.key)
                                ? "bg-primary/80 text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            <CheckboxIcon checked={batchCategorySelections.includes(sub.key)} small />
                            {language === "en" ? sub.nameEn : sub.nameMy}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {batchCategorySelections.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Selected: {batchCategorySelections.join(", ")}
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setIsBatchModalOpen(false);
                  setBatchCategorySelections([]);
                }}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyBatchUpdate}
                disabled={batchCategorySelections.length === 0 || isBatchLoading}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  batchMode === "add"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                }`}
              >
                {isBatchLoading 
                  ? "Applying..." 
                  : `${batchMode === "add" ? "Add" : "Remove"} to ${selectedDuaIds.length} duas`}
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

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CheckboxIcon({ checked, small }: { checked: boolean; small?: boolean }) {
  const size = small ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className={`${size} rounded border flex items-center justify-center shrink-0 ${
      checked 
        ? "bg-primary border-primary" 
        : "border-muted-foreground/40"
    }`}>
      {checked && (
        <svg className={small ? "h-2 w-2" : "h-3 w-3"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" className="text-primary-foreground" />
        </svg>
      )}
    </div>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  );
}
