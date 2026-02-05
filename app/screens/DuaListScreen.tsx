import React from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import {DuaListScreenType} from "@/app/types";
import {Colors} from "@/constants/theme";
import {useLanguage} from "@/app/contexts/LanguageContext";
import {LanguageEnums} from "@/constants/language-enums";
import {Ionicons} from "@expo/vector-icons";
import {useFonts} from "expo-font";
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";

export default function DuaListScreen({setScreen, duas, setSelectedDua, category}: DuaListScreenType) {
  const {language} = useLanguage()
  const [fontLoaded] = useFonts({
    'Mulish-Bold': require('@/assets/font/Mulish-Bold.ttf'),
  });
  const {width} = useWindowDimensions();
  const isTablet = width >= 768;

  if (!fontLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading fonts...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText style={styles.header}>
          <TouchableOpacity onPress={() => setScreen("home")}>
            <ThemedText>
              <Ionicons size={28} name={"chevron-back"}/>
            </ThemedText>
          </TouchableOpacity>
        </ThemedText>
        <ThemedText style={styles.title}>{category} Du&#39;a List</ThemedText>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {duas.map((dua, j) => (
            <TouchableOpacity
              key={j}
              style={[
                styles.listItem,
                isTablet && styles.listItemTablet
              ]}
              onPress={() => {
                setSelectedDua({
                  curr: j,
                  duas: duas,
                });
                setScreen("duaDetail");
              }}
            >
              <ThemedText
                style={styles.listText}>{language === LanguageEnums.EN ? dua.titleEn : dua.titleMy}</ThemedText>
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