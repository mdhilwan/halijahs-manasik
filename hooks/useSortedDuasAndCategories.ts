import { useMemo } from 'react';
import {CategoryType, DuaOrCategoryType, DuaType} from '@/config/types';
import { useHajiUmrahFilter } from "@/contexts/HajiUmrahFilterContext";
import duasJson from "@/assets/data/duas.json";

export const useSortedDuasAndCategories = (items: DuaOrCategoryType[], categoryKey: string) => {
  const { mode } = useHajiUmrahFilter();

  return useMemo(() => {
    const validCategoriesInMode = new Set<string>();
    duasJson.forEach((dua: DuaType) => {
      if (dua.categoryKey.includes(mode)) {
        dua.categoryKey.forEach((key: string) => {
          validCategoriesInMode.add(key);
        });
      }
    });

    const sorted = [...items];

    const filtered = sorted.filter((item: DuaOrCategoryType) => {
      if ((item as CategoryType).key) {
        return validCategoriesInMode.has((item as CategoryType).key);
      }
      return item;
    });

    filtered.sort((a: DuaOrCategoryType, b: DuaOrCategoryType) => {
      if (a.order === undefined || b.order === undefined) {
        return 0;
      }

      const aOrder = typeof a.order === 'number' ? a.order : categoryKey ? a.order[categoryKey] : 0;
      const bOrder = typeof b.order === 'number' ? b.order : categoryKey ? b.order[categoryKey] : 0;

      // @ts-ignore
      return aOrder - bOrder;
    });

    return filtered;
  }, [items, categoryKey, mode]);
};

