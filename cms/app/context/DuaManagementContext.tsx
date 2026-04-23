import React, { createContext, useContext } from "react";
import { DuaType } from "../../../config/types";
import { Category } from "../types";
import { PreviewData } from "../lib/serializeForPostMessage";

export interface DuaManagementContextType {
  // Data
  duas: DuaType[];
  categories: Category[];
  filteredDuas: DuaType[];

  // Search and filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  language: "en" | "my";
  setLanguage: (lang: "en" | "my") => void;
  filterNoAudio: boolean;
  setFilterNoAudio: (filter: boolean) => void;
  expandedCategories: string[];
  isFilterExpanded: boolean;
  setIsFilterExpanded: (expanded: boolean) => void;
  hasActiveFilters: boolean;

  // Filter functions
  toggleCategory: (categoryKey: string, isSubcategory?: boolean, parentKey?: string) => void;
  clearAllFilters: () => void;
  toggleExpanded: (categoryKey: string) => void;

  // Dua management
  createDua: () => Promise<void>;
  downloadDuas: () => void;

  // Add modal
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  newDuaTitle: { en: string; my: string };
  setNewDuaTitle: React.Dispatch<React.SetStateAction<{ en: string; my: string }>>;

  // Bulk edit
  selectedDuaIds: number[];
  allVisibleSelected: boolean;
  toggleDuaSelection: (duaId: number) => void;
  clearDuaSelection: () => void;
  selectAllVisible: () => void;

  // Batch modal
  isBatchModalOpen: boolean;
  setIsBatchModalOpen: (open: boolean) => void;
  batchMode: "add" | "remove";
  setBatchMode: (mode: "add" | "remove") => void;
  batchCategorySelections: string[];
  toggleBatchCategory: (categoryKey: string) => void;
  batchExpandedCategories: string[];
  toggleBatchExpanded: (categoryKey: string) => void;
  applyBatchUpdate: () => Promise<void>;
  isBatchLoading: boolean;

  // Preview sync
  hasUnsyncedChanges: boolean;
  previewData: PreviewData | null;
  syncPreview: (selectedDuaId?: number) => void;
}

export const DuaManagementContext = createContext<DuaManagementContextType | undefined>(undefined);

export function useDuaManagement() {
  const context = useContext(DuaManagementContext);
  if (!context) {
    throw new Error("useDuaManagement must be used within a DuaManagementProvider");
  }
  return context;
}
