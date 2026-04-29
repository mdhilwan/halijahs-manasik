"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { DuaType } from "../../../config/types";
import { Category } from "../types";
import { DuaManagementContext } from "./DuaManagementContext";
import { serializeForPostMessage, PreviewData } from "../lib/serializeForPostMessage";

export function DuaManagementProvider({ children }: { children: React.ReactNode }) {
  const [duas, setDuas] = useState<DuaType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [language, setLanguage] = useState<"en" | "my">("en");
  const [filterNoAudio, setFilterNoAudio] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Persist filters so they survive navigation (and even reloads)
  const FILTER_STORAGE_KEY = "manasik-cms:dua-filters:v1";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FILTER_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        searchQuery: string;
        selectedCategories: string[];
        language: "en" | "my";
        filterNoAudio: boolean;
        expandedCategories: string[];
        isFilterExpanded: boolean;
      }>;

      if (typeof parsed.searchQuery === "string") setSearchQuery(parsed.searchQuery);
      if (Array.isArray(parsed.selectedCategories)) setSelectedCategories(parsed.selectedCategories);
      if (parsed.language === "en" || parsed.language === "my") setLanguage(parsed.language);
      if (typeof parsed.filterNoAudio === "boolean") setFilterNoAudio(parsed.filterNoAudio);
      if (Array.isArray(parsed.expandedCategories)) setExpandedCategories(parsed.expandedCategories);
      if (typeof parsed.isFilterExpanded === "boolean") setIsFilterExpanded(parsed.isFilterExpanded);
    } catch {
      // ignore storage/JSON errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        FILTER_STORAGE_KEY,
        JSON.stringify({
          searchQuery,
          selectedCategories,
          language,
          filterNoAudio,
          expandedCategories,
          isFilterExpanded,
        })
      );
    } catch {
      // ignore storage quota / private mode issues
    }
  }, [
    searchQuery,
    selectedCategories,
    language,
    filterNoAudio,
    expandedCategories,
    isFilterExpanded,
  ]);

  // Bulk edit state
  const [selectedDuaIds, setSelectedDuaIds] = useState<number[]>([]);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchMode, setBatchMode] = useState<"add" | "remove">("add");
  const [batchCategorySelections, setBatchCategorySelections] = useState<string[]>([]);
  const [batchExpandedCategories, setBatchExpandedCategories] = useState<string[]>([]);
  const [isBatchLoading, setIsBatchLoading] = useState(false);

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDuaTitle, setNewDuaTitle] = useState({ en: "", my: "" });

  // Preview sync state
  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const previousDataRef = useRef<{ duas: DuaType[]; categories: Category[] }>({
    duas: [],
    categories: [],
  });

  useEffect(() => {
    fetch("/api/duas").then(r => r.json()).then(setDuas);
    fetch("/api/categories").then(r => r.json()).then(setCategories);
  }, []);

  // Track changes for preview sync
  useEffect(() => {
    const duasChanged = JSON.stringify(duas) !== JSON.stringify(previousDataRef.current.duas);
    const categoriesChanged =
      JSON.stringify(categories) !== JSON.stringify(previousDataRef.current.categories);

    if (duasChanged || categoriesChanged) {
      setHasUnsyncedChanges(true);
    }

    previousDataRef.current = {
      duas: JSON.parse(JSON.stringify(duas)),
      categories: JSON.parse(JSON.stringify(categories)),
    };
  }, [duas, categories]);

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

  const hasActiveFilters = !!(selectedCategories.length > 0 || filterNoAudio || searchQuery);

  function toggleCategory(categoryKey: string, isSubcategory: boolean = false, _parentKey?: string) {
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

  function downloadJson(filename: string, data: unknown) {
    // Client-only guard (helps prevent accidental server execution)
    if (typeof window === "undefined") return;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadDuas() {
    // Fire-and-forget tracking (server stores last-downloaded timestamp)
    fetch("/api/downloads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: "duas" }),
    }).catch(() => {});
    downloadJson("duas.json", duas);
  }

  function downloadCategories(categoriesOverride?: Category[]) {
    fetch("/api/downloads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: "categories" }),
    }).catch(() => {});
    const categoriesToDownload = categoriesOverride ?? categories;
    downloadJson("categories.json", { categories: categoriesToDownload });
  }

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

  const allVisibleSelected = filteredDuas.length > 0 && filteredDuas.every(d => selectedDuaIds.includes(d.id));

  function syncPreview(selectedDuaId?: number) {
    const serializedData = serializeForPostMessage(duas, categories, selectedDuaId);
    setPreviewData(serializedData);
    setHasUnsyncedChanges(false);
  }

  const value = {
    // Data
    duas,
    categories,
    filteredDuas,

    // Search and filters
    searchQuery,
    setSearchQuery,
    selectedCategories,
    language,
    setLanguage,
    filterNoAudio,
    setFilterNoAudio,
    expandedCategories,
    isFilterExpanded,
    setIsFilterExpanded,
    hasActiveFilters,

    // Filter functions
    toggleCategory,
    clearAllFilters,
    toggleExpanded,

    // Dua management
    createDua,
    downloadDuas,
    downloadCategories,

    // Add modal
    isAddModalOpen,
    setIsAddModalOpen,
    newDuaTitle,
    setNewDuaTitle,

    // Bulk edit
    selectedDuaIds,
    allVisibleSelected,
    toggleDuaSelection,
    clearDuaSelection,
    selectAllVisible,

    // Batch modal
    isBatchModalOpen,
    setIsBatchModalOpen,
    batchMode,
    setBatchMode,
    batchCategorySelections,
    toggleBatchCategory,
    batchExpandedCategories,
    toggleBatchExpanded,
    applyBatchUpdate,
    isBatchLoading,

    // Preview sync
    hasUnsyncedChanges,
    previewData,
    syncPreview,
  };

  return (
    <DuaManagementContext.Provider value={value}>
      {children}
    </DuaManagementContext.Provider>
  );
}
