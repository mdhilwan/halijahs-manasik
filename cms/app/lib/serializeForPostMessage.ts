import { DuaType } from "../../../config/types";
import { Category } from "../types";

export interface PreviewData {
  duas: DuaType[];
  categories: Category[];
  timestamp: number;
  selectedDuaId?: number; // Optional: ID of dua to focus on in preview
}

/**
 * Serialize duas and categories data for safe transmission via postMessage
 * Handles circular references and ensures data is JSON-serializable
 */
export function serializeForPostMessage(
  duas: DuaType[],
  categories: Category[],
  selectedDuaId?: number
): PreviewData {
  return {
    duas: JSON.parse(JSON.stringify(duas)),
    categories: JSON.parse(JSON.stringify(categories)),
    timestamp: Date.now(),
    selectedDuaId,
  };
}

/**
 * Validate preview data structure
 */
export function validatePreviewData(data: any): data is PreviewData {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.duas) &&
    Array.isArray(data.categories) &&
    typeof data.timestamp === "number"
  );
}

