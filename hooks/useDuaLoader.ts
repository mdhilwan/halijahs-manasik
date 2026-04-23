import { useCallback } from 'react';
import duasJson from '@/assets/data/duas.json';
import categoriesData from '@/assets/data/categories.json';
import { DuaType } from '@/config/types';
import {useHajiUmrahFilter} from "@/contexts/HajiUmrahFilterContext";

// Try to import CMSDataContext (only available on web)
let useCMSData: (() => any) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const CMSModule = require('@/contexts/CMSDataContext');
  useCMSData = CMSModule.useCMSData;
} catch (e) {
  // CMSDataContext not available (e.g., on native platforms)
}

/**
 * Custom hook for handling dua filtering and loading logic
 */
export const useDuaLoader = () => {
  const { mode } = useHajiUmrahFilter();
  
  // Try to get CMS data if available (web preview mode)
  let cmsData = null;
  if (useCMSData) {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      cmsData = useCMSData();
    } catch (e) {
      // Not in CMSDataProvider context
    }
  }

  const currentDuas = cmsData?.duas || duasJson;
  const currentCategories = cmsData?.categories || categoriesData;
  const selectedDuaId = cmsData?.selectedDuaId;

  const loadDuas = useCallback((category: string): DuaType[] => {
    // Filter duas by category
    let result = currentDuas.filter((d: DuaType) => {
      return d.categoryKey?.includes(category.toLowerCase()) ?? false;
    });

    // Get subcategories
    const subCategories = currentCategories.categories.find(
      (cat: { key: string; }) => cat.key === category.toLowerCase()
    )?.subcategories;

    if (subCategories) {
      const subCategoriesKeys = subCategories.map((cat: { key: any; }) => cat.key);
      const subCategoriesResult = currentDuas.filter((d: DuaType) => {
        return d.categoryKey?.some((key) => subCategoriesKeys.includes(key)) ?? false;
      });
      result = [...result, ...subCategoriesResult];
    }

    return result.filter((item: { categoryKey: string | string[]; }) => item.categoryKey.includes(mode)) as DuaType[];
  }, [mode, currentDuas, currentCategories]);

  /**
   * Load a specific dua by ID
   * Used for direct dua preview/navigation
   */
  const loadDuaById = useCallback((duaId: number): DuaType | undefined => {
    return currentDuas.find((d: DuaType) => d.id === duaId);
  }, [currentDuas]);

  return { loadDuas, loadDuaById, selectedDuaId, currentDuas, cmsData: !!cmsData };
};

