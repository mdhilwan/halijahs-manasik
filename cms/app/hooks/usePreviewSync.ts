"use client";
import { useEffect, useRef } from "react";
import { DuaType } from "../../../config/types";
import { Category } from "../types";

interface UsePreviewSyncOptions {
  duas: DuaType[];
  categories: Category[];
  onChangesDetected?: (hasChanges: boolean) => void;
}

export function usePreviewSync({
  duas,
  categories,
  onChangesDetected,
}: UsePreviewSyncOptions) {
  const previousDataRef = useRef<{ duas: DuaType[]; categories: Category[] }>({
    duas: [],
    categories: [],
  });

  const hasChanges = useRef(false);

  useEffect(() => {
    // Deep equality check
    const duasChanged = JSON.stringify(duas) !== JSON.stringify(previousDataRef.current.duas);
    const categoriesChanged =
      JSON.stringify(categories) !== JSON.stringify(previousDataRef.current.categories);

    if (duasChanged || categoriesChanged) {
      hasChanges.current = true;
      onChangesDetected?.(true);
    }

    // Update previous data
    previousDataRef.current = {
      duas: JSON.parse(JSON.stringify(duas)),
      categories: JSON.parse(JSON.stringify(categories)),
    };
  }, [duas, categories, onChangesDetected]);

  const syncPreview = () => {
    hasChanges.current = false;
    onChangesDetected?.(false);
    return { duas, categories };
  };

  return {
    hasChanges: hasChanges.current,
    syncPreview,
  };
}

