import React from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import {DuaType, HomeStackParamList } from "@/config/types";
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

  let subcategoriesObj: any = categoriesData.categories.find(cat => cat.key === category);

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

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <ThemedText>
              <Ionicons size={28} name={"chevron-back"}/>
            </ThemedText>
          </TouchableOpacity>
        </ThemedText>
        <ThemedText style={styles.title}>{language === LanguageEnums.EN ? subcategoriesObj?.nameEn : subcategoriesObj?.nameMy} Du&#39;a List</ThemedText>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {initialDuas.filter((dua) => dua.categoryKey.includes(category)).map((dua, j) => (
            <TouchableOpacity
              key={j}
              style={[
                styles.listItem,
                isTablet && styles.listItemTablet
              ]}
              onPress={() => handleSelectDua(dua)}
            >
              <ThemedText
                style={styles.listText}>{language === LanguageEnums.EN ? dua.titleEn : dua.titleMy}</ThemedText>
            </TouchableOpacity>
          ))}
          {subcategoriesObj?.subcategories?.map((sub: { key: string; nameEn: string; nameMy: string }, k: React.Key | null | undefined) => (
            <TouchableOpacity
              key={k}
              style={[
                styles.listItem,
                isTablet && styles.listItemTablet
              ]}
              onPress={() => {
                navigation.push('duaList', {
                  category: sub.key,
                  duas: initialDuas,
                });
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