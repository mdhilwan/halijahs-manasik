import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import duas from "@/assets/data/duas.json";
import {DuaEngMalayArabicType, DuaType, SelectedDuaType} from "@/app/types";
import {useLanguage} from "@/app/contexts/LanguageContext";
import DuaDetailScreen from "@/app/screens/DuaDetailScreen";
import {useFontSize} from "@/app/contexts/FontSettingsContext";
import {ThemedText} from "@/components/themed-text";

export default function Search() {
  const [query, setQuery] = useState("");
  const [screen, setScreen] = useState("home");
  const [selectedDua, setSelectedDua] = useState<SelectedDuaType>(undefined);
  const {language} = useLanguage();
  const {translationFontSize} = useFontSize()

  const filterDuas = (q: string) => {
    const qLower = q.toLowerCase();
    return duas.filter(
      (duaObj: DuaType) => {
        const doaList = duaObj.doa.map((d: DuaEngMalayArabicType) => {
          const dTranslationEn = Array.isArray(d.translationEn) ? d.translationEn.map(d => d.toLowerCase()) : d.translationEn.toLowerCase();
          const dTranslationMy = Array.isArray(d.translationMy) ? d.translationMy.map(d => d.toLowerCase()) : d.translationMy.toLowerCase();

          return [d.arabic, dTranslationEn, dTranslationMy].join(" ");
        }).join("")
        return duaObj.titleEn?.toLowerCase().includes(qLower) ||
          duaObj.titleMy?.toLowerCase().includes(qLower) ||
          doaList.indexOf(qLower) > -1
      }
    );
  };

  const filtered = query ? filterDuas(query) : duas;

  switch (screen) {
    case "duaDetail":
      return <DuaDetailScreen setScreen={setScreen} selectedDua={selectedDua} setSelectedDua={setSelectedDua} />;
    case "home":
      return (
        <View style={[styles.container, {paddingTop: 75}]}>
          <TextInput
            style={styles.input}
            placeholder="Search duas..."
            value={query}
            onChangeText={setQuery}
            clearButtonMode="while-editing"
          />
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item?.id)}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => {
                setScreen("duaDetail");
                setSelectedDua({
                  curr: 0,
                  duas: [item],
                })
              }}>
                <ThemedText type={"defaultBold"} style={[styles.title, { fontSize: translationFontSize }]}>{language === "en" ? item.titleEn : item.titleMy}</ThemedText>
                <ThemedText style={[styles.snippet, { fontSize: translationFontSize }]} numberOfLines={2}>
                  {language === "en" ? item.doa[0].translationEn : item.doa[0].translationMy}
                </ThemedText>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={styles.empty}>No duas found.</Text>
            }
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 18,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    fontSize: 18,
    borderBottomColor: "#eee",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  snippet: {
    color: "#444",
    fontSize: 16,
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 16,
  },
});