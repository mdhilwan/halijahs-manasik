import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import type { FuseResultMatch } from 'fuse.js';

import type { CategoryType, DuaEngMalayArabicType, DuaType, LanguageType } from '@/config/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HighlightedText } from '@/components/search/highlighted-text';
import { buildDuaFuse, type DuaFuseResult } from '@/components/search/dua-fuse-config';

export type SearchEngineProps = {
  data: DuaType[];
  categoriesData?: { categories: CategoryType[] };
  language: LanguageType;
  onSelectDua?: (dua: DuaType) => void;

  /** Debounce duration for query updates (default: 250ms). */
  debounceMs?: number;

  /**
   * When the query is empty, return all items (default) or an empty list.
   * For large datasets, you may want `false`.
   */
  emptyQueryReturnsAll?: boolean;
};

const MODE_KEYS = new Set(['haji', 'umrah']);

function getTranslationText(value: DuaEngMalayArabicType['translationEn'] | DuaEngMalayArabicType['translationMy']) {
  if (Array.isArray(value)) return value.join(' ');
  return value;
}

function buildCategoryLookup(categoriesData?: { categories: CategoryType[] }) {
  const lookup = new Map<string, { nameEn: string; nameMy: string }>();
  if (!categoriesData?.categories) return lookup;

  for (const cat of categoriesData.categories) {
    lookup.set(cat.key, { nameEn: cat.nameEn, nameMy: cat.nameMy });
    for (const sub of cat.subcategories ?? []) {
      lookup.set(sub.key, { nameEn: sub.nameEn, nameMy: sub.nameMy });
    }
  }

  return lookup;
}

function getCategoryLabel(dua: DuaType, language: LanguageType, categoryLookup: Map<string, { nameEn: string; nameMy: string }>) {
  const keysWithoutMode = dua.categoryKey?.filter((k) => !MODE_KEYS.has(k)) ?? [];
  const displayKeys = keysWithoutMode.length ? keysWithoutMode : (dua.categoryKey ?? []);

  const names = displayKeys
    .map((k) => {
      const match = categoryLookup.get(k);
      if (!match) return k;
      return language === 'en' ? match.nameEn : match.nameMy;
    })
    // de-dupe while preserving order
    .filter((name, idx, arr) => arr.indexOf(name) === idx);

  // Keep it short for a row UI.
  return names.slice(0, 2).join(' • ');
}

function findFirstMatch(result: DuaFuseResult, key: string) {
  return result.matches?.find((m: FuseResultMatch) => String(m.key) === key);
}

function findFirstTranslationMatch(result: DuaFuseResult, language: LanguageType) {
  const targetKey = language === 'en' ? 'doa.translationEn' : 'doa.translationMy';
  return result.matches?.find((m: FuseResultMatch) => String(m.key) === targetKey);
}

export function SearchEngine({
  data,
  categoriesData,
  language,
  onSelectDua,
  debounceMs = 250,
  emptyQueryReturnsAll = true,
}: SearchEngineProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const categoryLookup = useMemo(() => buildCategoryLookup(categoriesData), [categoriesData]);

  // Build Fuse once per dataset (and rebuild only when the dataset itself changes).
  const fuse = useMemo(() => buildDuaFuse(data), [data]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(t);
  }, [query, debounceMs]);

  const results: DuaFuseResult[] = useMemo(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      return emptyQueryReturnsAll
        ? data.map((item) => ({ item, refIndex: -1, score: undefined, matches: undefined }))
        : [];
    }

    return fuse.search(trimmed);
  }, [data, debouncedQuery, emptyQueryReturnsAll, fuse]);

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search duas..."
        value={query}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />

      <FlatList
        onScrollBeginDrag={Keyboard.dismiss}
        keyboardShouldPersistTaps="handled"
        data={results}
        keyExtractor={(r) => String(r.item.id)}
        renderItem={({ item: result }) => {
          const dua = result.item;

          const titleKey = language === 'en' ? 'titleEn' : 'titleMy';
          const titleText = language === 'en' ? dua.titleEn : dua.titleMy;
          const titleMatch = findFirstMatch(result, titleKey);

          const categoryLabel = getCategoryLabel(dua, language, categoryLookup);

          const translationFallback = dua.doa?.[0]
            ? getTranslationText(language === 'en' ? dua.doa[0].translationEn : dua.doa[0].translationMy)
            : '';

          const translationMatch = findFirstTranslationMatch(result, language);
          const snippetText = typeof translationMatch?.value === 'string' ? translationMatch.value : translationFallback;
          const snippetIndices = typeof translationMatch?.value === 'string' ? translationMatch.indices : undefined;

          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => onSelectDua?.(dua)}
              accessibilityRole="button"
              accessibilityLabel={titleText}
            >
              <ThemedView style={styles.rowHeader}>
                <HighlightedText
                  type="defaultBold"
                  style={styles.title}
                  text={titleText}
                  indices={titleMatch?.indices}
                  highlightStyle={styles.highlight}
                  numberOfLines={1}
                />
                {!!categoryLabel && (
                  <ThemedText style={styles.category} numberOfLines={1}>
                    {categoryLabel}
                  </ThemedText>
                )}
              </ThemedView>

              <HighlightedText
                style={styles.snippet}
                text={snippetText}
                indices={snippetIndices}
                highlightStyle={styles.highlight}
                numberOfLines={2}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<ThemedText style={styles.empty}>No results found.</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 18,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    flex: 1,
  },
  category: {
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 12,
  },
  snippet: {
    marginTop: 6,
    fontSize: 16,
    opacity: 0.9,
  },
  highlight: {
    backgroundColor: 'rgba(255, 214, 0, 0.35)',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});

