import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { DuaListScreenType } from "@/app/types";
import {Colors} from "@/constants/theme";
import {useLanguage} from "@/app/contexts/LanguageContext";

export default function DuaListScreen({ setScreen, duas, setSelectedDua, category }: DuaListScreenType) {
  const {language} = useLanguage()
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>{category} Du’a List</Text>
      <ScrollView>
        {duas.map((dua, j) => (
          <TouchableOpacity
            key={j}
            style={styles.listItem}
            onPress={() => {
              setSelectedDua({
                curr: j,
                duas: duas,
              });
              setScreen("duaDetail");
            }}
          >
            <Text style={styles.listText}>{language === 'en' ? dua.titleEn : dua.titleMy}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  listItem: { backgroundColor: Colors.light.tint, padding: 20, marginVertical: 8, borderRadius: 10 },
  listText: { fontSize: 18, color: '#ffd65c' },
  back: { fontSize: 18, color: '#505050', marginBottom: 10 },
});