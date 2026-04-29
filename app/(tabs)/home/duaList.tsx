import React, { useMemo, useCallback, memo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {TouchableOpacity, ScrollView, useWindowDimensions} from 'react-native';
import { CategoryType, DuaOrCategoryType, DuaType, HomeStackParamList } from '@/config/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageEnums } from '@/constants/language-enums';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import categoriesData from '@/assets/data/categories.json';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '@/constants/theme';
import { useFontLoader } from '@/hooks/useFontLoader';
import { useSortedDuasAndCategories } from '@/hooks/useSortedDuasAndCategories';
import { duaListStyles as styles } from './styles/homeScreenStyles';

type DuaListScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'duaList'>;

// Memoized item component to prevent unnecessary re-renders
interface DuaListItemProps {
  item: DuaOrCategoryType;
  language: string;
  isTablet: boolean;
  onSelectDua: (dua: DuaType) => void;
  onNavigateToSubcategory: (key: string) => void;
}

const DuaListItem = memo<DuaListItemProps>(({ 
  item, 
  language, 
  isTablet, 
  onSelectDua, 
  onNavigateToSubcategory 
}) => {
  const isDua = 'doa' in item;
  const displayName = isDua
    ? language === LanguageEnums.EN
      ? (item as DuaType).titleEn
      : (item as DuaType).titleMy
    : language === LanguageEnums.EN
    ? (item as CategoryType).nameEn
    : (item as CategoryType).nameMy;

  return (
    <TouchableOpacity
      key={(item as any).key}
      style={[styles.listItem, isTablet && styles.listItemTablet]}
      onPress={() =>
        isDua
          ? onSelectDua(item as DuaType)
          : onNavigateToSubcategory((item as CategoryType).key)
      }
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={displayName}
    >
      <ThemedView style={styles.listItemContent}>
        <ThemedText style={styles.iconContainer}>
          <Ionicons
            size={20}
            name={isDua ? 'book' : 'folder'}
            color={isDua ? Colors.light.icon : Colors.dark.tabIconDefault}
          />
        </ThemedText>
        <ThemedText style={styles.listText}>{displayName}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these props change
  return (
    (prevProps.item as any).key === (nextProps.item as any).key &&
    prevProps.language === nextProps.language &&
    prevProps.isTablet === nextProps.isTablet
  );
});

DuaListItem.displayName = 'DuaListItem';

/**
 * Renders the list of duas and subcategories for a given category
 */
export default function DuaListScreen() {
  const navigation = useNavigation<DuaListScreenNavigationProp>();
  const route = useRoute();
  const { category, duas: initialDuas, parent } = route.params as { category: string; duas: DuaType[]; parent?: { category: string; duas: DuaType[] } };

  const { language } = useLanguage();
  const fontLoaded = useFontLoader();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Get subcategory info - optimized lookup
  const subcategoryObj: CategoryType | undefined = useMemo(() => {
    // First, search in main categories
    const mainCategory = categoriesData.categories.find(cat => cat.key === category);
    if (mainCategory) return mainCategory;
    
    // If not found, search in subcategories
    for (const cat of categoriesData.categories) {
      if (cat.subcategories) {
        const found = cat.subcategories.find(subcat => subcat.key === category);
        if (found) return found as CategoryType;
      }
    }
    
    return undefined;
  }, [category]);

  const combinedDuasAndSubcategories: DuaOrCategoryType[] = useMemo(() => {
    const filteredDuas = initialDuas.filter(dua => dua.categoryKey.includes(category));
    const subcategories = (subcategoryObj?.subcategories as CategoryType[]) || [];
    return [...filteredDuas, ...subcategories];
  }, [initialDuas, category, subcategoryObj]);

  const sortedItems = useSortedDuasAndCategories(combinedDuasAndSubcategories, category);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Memoize the final duas list to prevent unnecessary re-renders of callbacks
  const sortedItemsInitialDuas: DuaType[] = useMemo(() => {
    if (parent?.duas) {
      return parent.duas;
    }

    const seen = new Set<number | string>(); // depends on your DuaType.id type
    const out: DuaType[] = [];

    const pushUnique = (dua: DuaType) => {
      if (seen.has(dua.id)) return;
      seen.add(dua.id);
      out.push(dua);
    };

    for (const item of sortedItems) {
      if ('doa' in item) {
        // item is a Dua -> keep it
        pushUnique(item as DuaType);
      } else {
        // item is a Category/Subcategory -> expand to all duas that belong to it
        const key = (item as CategoryType).key;

        // Since you're confident CMS ensures correct keys, includes() is OK.
        // If you ever want “immediate child only”, adjust this predicate.
        const matching = initialDuas.filter(dua => dua.categoryKey.includes(key));

        for (const dua of matching) pushUnique(dua);
      }
    }

    return out;
  }, [parent?.duas, sortedItems, initialDuas]);

  const handleSelectDua = useCallback((dua: DuaType) => {
    navigation.navigate('duaDetail', {
      selectedDua: {
        curr: dua.id,
        duas: sortedItemsInitialDuas,
      },
    });
  }, [navigation, sortedItemsInitialDuas]);

  const handleNavigateToSubcategory = useCallback((subcategoryKey: string) => {
    navigation.push('duaList', {
      category: subcategoryKey,
      duas: sortedItemsInitialDuas,
      parent: {
        category: category,
        duas: sortedItemsInitialDuas
      },
    });
  }, [navigation, category, sortedItemsInitialDuas]);

  if (!fontLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>Loading fonts...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ThemedText>
              <Ionicons size={36} name="chevron-back" />
            </ThemedText>
          </TouchableOpacity>
        </ThemedText>

        <ThemedText style={styles.title}>
          {language === LanguageEnums.EN ? subcategoryObj?.nameEn : subcategoryObj?.nameMy} Du&apos;a List
        </ThemedText>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {sortedItems.map((item: DuaOrCategoryType, index: number) => (
            <DuaListItem
              key={index}
              item={item}
              language={language}
              isTablet={isTablet}
              onSelectDua={handleSelectDua}
              onNavigateToSubcategory={handleNavigateToSubcategory}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
