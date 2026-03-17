import React from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import {DuaListScreenType, DuaType} from "@/app/types";
import {Colors} from "@/constants/theme";
import {useLanguage} from "@/app/contexts/LanguageContext";
import {LanguageEnums} from "@/constants/language-enums";
import {Ionicons} from "@expo/vector-icons";
import {useFonts} from "expo-font";
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";
import categoriesData from '@/assets/data/categories.json'

export default function DuaListScreen({setScreen, duas, setSelectedDua, category, setCategory}: DuaListScreenType) {
  const {language} = useLanguage()
  const [fontLoaded] = useFonts({
    'Mulish-Bold': require('@/assets/font/Mulish-Bold.ttf'),
  });
  const {width} = useWindowDimensions();
  const isTablet = width >= 768;
  let parentCategory: React.SetStateAction<string> | undefined;

  if (!fontLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>Loading fonts...</ThemedText>
      </SafeAreaView>
    );
  }

  let subcategoriesObj: any = categoriesData.categories.find(cat => cat.key === category);

  if (!subcategoriesObj) {
    subcategoriesObj = categoriesData.categories
      .map(cat => cat.subcategories)
      .flat()
      .find((cat) => cat.key === category);
  }


  const isSubcategory = !Object.hasOwn(subcategoriesObj, "subcategories")

  if (isSubcategory) {
    parentCategory = categoriesData.categories.find((cat) => cat.subcategories.find(sub => sub.key === category))?.key;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText style={styles.header}>
          <TouchableOpacity onPress={() => {
            if (!isSubcategory) {
              setScreen("home")
            } else if (isSubcategory && parentCategory) {
              setCategory(parentCategory);
              setScreen("duaList")
            }
          }}>
            <ThemedText>
              <Ionicons size={28} name={"chevron-back"}/>
            </ThemedText>
          </TouchableOpacity>
        </ThemedText>
        <ThemedText style={styles.title}>{language === LanguageEnums.EN ? subcategoriesObj?.nameEn : subcategoriesObj?.nameMy} Du&#39;a List</ThemedText>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {duas.filter((dua) => dua.categoryKey.includes(category)).map((dua, j) => (
            <TouchableOpacity
              key={j}
              style={[
                styles.listItem,
                isTablet && styles.listItemTablet
              ]}
              onPress={() => {
                setSelectedDua({
                  curr: dua.id,
                  duas: duas,
                });
                setScreen("duaDetail");
              }}
            >
              <ThemedText
                style={styles.listText}>{language === LanguageEnums.EN ? dua.titleEn : dua.titleMy}</ThemedText>
            </TouchableOpacity>
          ))}
          {subcategoriesObj?.subcategories?.map((sub: { key: React.SetStateAction<string>; nameEn: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; nameMy: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, k: React.Key | null | undefined) => (
            <TouchableOpacity
              key={k}
              style={[
                styles.listItem,
                isTablet && styles.listItemTablet
              ]}
              onPress={() => {
                setCategory(sub.key);
                setScreen('duaList');
              }}
            >
              <ThemedText
                style={styles.listText}>{language === LanguageEnums.EN ? sub.nameEn : sub.nameMy}</ThemedText>
            </TouchableOpacity>
          ))}
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
  listText: {fontSize: 18, fontFamily: 'Mulish-Bold', color: Colors.base.tint, textTransform: 'capitalize'},
  back: {fontSize: 18, marginBottom: 10},
});