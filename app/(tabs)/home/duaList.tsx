import React from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import {CategoryType, DuaOrCategoryType, DuaType, HomeStackParamList} from "@/config/types";
import {useLanguage} from "@/contexts/LanguageContext";
import {LanguageEnums} from "@/constants/language-enums";
import {Ionicons} from "@expo/vector-icons";
import {useFonts} from "expo-font";
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";
import categoriesData from '@/assets/data/categories.json'
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {Colors} from "@/constants/theme";

type DuaListScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'duaList'>;

export default function DuaListScreen() {
  const navigation = useNavigation<DuaListScreenNavigationProp>();
  const route = useRoute();
  const { category, duas: initialDuas } = route.params as { category: string; duas: DuaType[] };

  const {language} = useLanguage()
  const [fontLoaded] = useFonts({
    'Mulish-Bold': require('@/assets/font/Mulish-Bold.ttf'),
  });
  const {width} = useWindowDimensions();
  const isTablet = width >= 768;

  if (!fontLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>Loading fonts...</ThemedText>
      </SafeAreaView>
    );
  }

  let subcategoriesObj: CategoryType[] | any = categoriesData.categories.find(cat => cat.key === category);

  if (!subcategoriesObj) {
    subcategoriesObj = categoriesData.categories
      .map(cat => cat.subcategories)
      .flat()
      .find((cat) => cat.key === category);
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelectDua = (dua: DuaType) => {
    navigation.navigate('duaDetail', {
      selectedDua: {
        curr: dua.id,
        duas: initialDuas,
      }
    });
  };

  const filteredInitialDuas = initialDuas.filter((dua) => dua.categoryKey.includes(category));

  const combinedDuasAndSubcategories: DuaOrCategoryType[] = [
    ...filteredInitialDuas,
    ...(subcategoriesObj?.subcategories || [])
  ];

  combinedDuasAndSubcategories.sort((a: DuaOrCategoryType, b: DuaOrCategoryType) => {
    if (a.order !== undefined && b.order !== undefined) {
      if (typeof a.order === "number" && typeof b.order === "number") {
        return a.order - b.order;
      } else if (typeof a.order !== "number" && typeof b.order === "number") {
        return a.order[category] - b.order;
      } else if (typeof a.order === "number" && typeof b.order !== "number") {
        return a.order - b.order[category];
      } else if (typeof a.order !== "number" && typeof b.order !== "number") {
        return a.order[category] - b.order[category];
      }
    }
    return 0;
  })

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <ThemedText>
              <Ionicons size={36} name={"chevron-back"}/>
            </ThemedText>
          </TouchableOpacity>
        </ThemedText>
        <ThemedText style={styles.title}>{language === LanguageEnums.EN ? subcategoriesObj?.nameEn : subcategoriesObj?.nameMy} Du&#39;a List</ThemedText>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {
            combinedDuasAndSubcategories.map((item: DuaOrCategoryType, index) => {
              if ('doa' in item) {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.listItem,
                      isTablet && styles.listItemTablet
                    ]}
                    onPress={() => handleSelectDua(item)}
                  >
                    <ThemedText
                      style={styles.listText}>{language === LanguageEnums.EN ? item.titleEn : item.titleMy}</ThemedText>
                  </TouchableOpacity>
                );
              } else {
                 return (
                   <TouchableOpacity
                     key={index}
                     style={[
                       styles.listItem,
                       isTablet && styles.listItemTablet
                     ]}
                     onPress={() => {
                       navigation.push('duaList', {
                         category: item.key,
                         duas: initialDuas,
                       });
                     }}
                   >
                     <ThemedText
                       style={styles.listText}>{language === LanguageEnums.EN ? item.nameEn : item.nameMy}</ThemedText>
                   </TouchableOpacity>
                 );
              }
            })
          }
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