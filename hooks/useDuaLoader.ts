import { useCallback } from 'react';
import duasJson from '@/assets/data/duas.json';
import categoriesData from '@/assets/data/categories.json';
import { DuaType } from '@/config/types';
import {useHajiUmrahFilter} from "@/contexts/HajiUmrahFilterContext";

/**
 * Custom hook for handling dua filtering and loading logic
 */
export const useDuaLoader = () => {
  const { mode } = useHajiUmrahFilter();

  const loadDuas = useCallback((category: string): DuaType[] => {
    // Filter duas by category
    let result = duasJson.filter((d: DuaType) => {
      return d.categoryKey?.includes(category.toLowerCase()) ?? false;
    });

    // Get subcategories
    const subCategories = categoriesData.categories.find(
      (cat) => cat.key === category.toLowerCase()
    )?.subcategories;

    if (subCategories) {
      const subCategoriesKeys = subCategories.map(cat => cat.key);
      const subCategoriesResult = duasJson.filter((d: DuaType) => {
        return d.categoryKey?.some((key) => subCategoriesKeys.includes(key)) ?? false;
      });
      result = [...result, ...subCategoriesResult];
    }

    return result.filter(item => item.categoryKey.includes(mode)) as DuaType[];
  }, [mode]);

  return { loadDuas };
};

