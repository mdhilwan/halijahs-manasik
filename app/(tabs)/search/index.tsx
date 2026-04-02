import React, {useState} from "react";
import {
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet, TouchableWithoutFeedback, Keyboard,
} from "react-native";
import duas from "@/assets/data/duas.json";
import {DuaEngMalayArabicType, DuaType} from "@/config/types";
import {useLanguage} from "@/contexts/LanguageContext";
import {useFontSize} from "@/contexts/FontSettingsContext";
import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {useRouter} from "expo-router";

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
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

  const handleSelectDua = (item: DuaType) => {
    router.push({
      pathname: '/home/duaDetail',
      params: {
        selectedDua: JSON.stringify({curr: item.id})
      }
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ThemedView style={[styles.container, {paddingTop: 75}]}>
        <TextInput
          style={styles.input}
          placeholder="Search duas..."
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
        />
        <FlatList
          onScrollBeginDrag={Keyboard.dismiss}
          data={filtered}
          keyExtractor={(item) => String(item?.id)}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.item} onPress={() => handleSelectDua(item)}>
              <ThemedText type={"defaultBold"} style={[
                styles.title,
                {fontSize: translationFontSize}
              ]}>{language === "en" ? item.titleEn : item.titleMy}</ThemedText>
              <ThemedText style={[styles.snippet, {fontSize: translationFontSize}]} numberOfLines={2}>
                {language === "en" ? item.doa[0].translationEn : item.doa[0].translationMy}
              </ThemedText>
            </TouchableOpacity>
          )}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <ThemedText style={styles.empty}>No duas found.</ThemedText>
          }
        />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
