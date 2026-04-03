import React, { useMemo, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
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

type DuaListScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'duaList'>;

/**
 * Renders the list of duas and subcategories for a given category
 */
export default function DuaListScreen() {
  const navigation = useNavigation<DuaListScreenNavigationProp>();
  const route = useRoute();
  const { category, duas: initialDuas } = route.params as { category: string; duas: DuaType[] };

  const { language } = useLanguage();
  const fontLoaded = useFontLoader();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Get subcategory info
  const subcategoryObj: CategoryType | undefined = useMemo(() => {
    let obj = categoriesData.categories.find(cat => cat.key === category);
    
    if (!obj) {
      obj = categoriesData.categories
        .flatMap(cat => cat.subcategories || [])
        .find(cat => cat.key === category) as any;
    }
    
    return obj;
  }, [category]);

  // Filter duas for this category and combine with subcategories
  const combinedDuasAndSubcategories: DuaOrCategoryType[] = useMemo(() => {
    const filteredDuas = initialDuas.filter(dua => dua.categoryKey.includes(category));
    const subcategories = (subcategoryObj as any)?.subcategories || [];
    return [...filteredDuas, ...subcategories];
  }, [initialDuas, category, subcategoryObj]);

  // Sort the combined list
  const sortedItems = useSortedDuasAndCategories(combinedDuasAndSubcategories, category);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectDua = useCallback((dua: DuaType) => {
    navigation.navigate('duaDetail', {
      selectedDua: {
        curr: dua.id,
        duas: initialDuas,
      },
    });
  }, [navigation, initialDuas]);

  const handleNavigateToSubcategory = useCallback((subcategoryKey: string) => {
    navigation.push('duaList', {
      category: subcategoryKey,
      duas: initialDuas,
    });
  }, [navigation, initialDuas]);

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
          <TouchableOpacity onPress={handleBack} accessible={true} accessibilityRole="button" accessibilityLabel="Go back">
            <ThemedText>
              <Ionicons size={36} name="chevron-back" />
            </ThemedText>
          </TouchableOpacity>
        </ThemedText>

        <ThemedText style={styles.title}>
          {language === LanguageEnums.EN ? subcategoryObj?.nameEn : subcategoryObj?.nameMy} Du&apos;a List
        </ThemedText>

        <ScrollView contentContainerStyle={styles.listContainer}>
          {sortedItems.map((item: DuaOrCategoryType, index) => {
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
                key={`${item.key}-${index}`}
                style={[styles.listItem, isTablet && styles.listItemTablet]}
                onPress={() =>
                  isDua
                    ? handleSelectDua(item as DuaType)
                    : handleNavigateToSubcategory((item as CategoryType).key)
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
                  <ThemedText style={[
                    styles.listText
                  ]}>{displayName}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fontSettings: {
    fontSize: 20,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Mulish-Bold',
    textTransform: 'capitalize',
    textAlign: 'center',
    marginVertical: 20
  },
  listItem: {backgroundColor: Colors.light.tint, padding: 20, marginVertical: 8, borderRadius: 10, width: '100%'},
  listItemTablet: {
    width: '49%',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: "transparent",
  },
  iconContainer: {
    marginRight: 8,
  },
  listText: {fontSize: 18, fontFamily: 'Mulish-Bold', textTransform: 'capitalize', flex: 1, color: "white"},
  back: {fontSize: 18, marginBottom: 10},
});