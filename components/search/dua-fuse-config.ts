import Fuse from 'fuse.js';
import type { FuseResult, IFuseOptions } from 'fuse.js';

import type { DuaType } from '@/config/types';

/**
 * Fuse configuration for dua search.
 *
 * Notes:
 * - `threshold: 0.3` keeps matches fairly strict while still allowing typos.
 * - `ignoreLocation: true` allows matching anywhere in the string.
 * - Weights bias results toward titles, then category tags.
 * - `includeMatches: true` is used to highlight matched substrings in the UI.
 */
export const DUA_FUSE_OPTIONS: IFuseOptions<DuaType> = {
  isCaseSensitive: false,
  includeScore: true,
  includeMatches: true,
  ignoreLocation: true,
  threshold: 0.3,
  // Keeping a small minimum reduces noisy results and improves perf.
  minMatchCharLength: 2,
  keys: [
    // Highest priority
    { name: 'titleEn', weight: 0.5 },
    // Second priority
    { name: 'titleMy', weight: 0.3 },
    // Category tags / keys
    { name: 'categoryKey', weight: 0.2 },

    // Also searchable (no explicit weight requirement; keep low so titles dominate)
    { name: 'doa.translationEn', weight: 0.05 },
    { name: 'doa.translationMy', weight: 0.05 },
  ],
};

export type DuaFuseResult = FuseResult<DuaType>;

export function buildDuaFuse(duas: DuaType[]) {
  return new Fuse(duas, DUA_FUSE_OPTIONS);
}

