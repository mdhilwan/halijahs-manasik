import React from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {useLanguage} from "@/contexts/LanguageContext";
import {ThemedView} from "@/components/themed-view";
import {useRouter} from "expo-router";
import {SearchEngine} from "@/components/search/SearchEngine";
import {useDuaLoader} from "@/hooks/useDuaLoader";
import type {DuaType} from "@/config/types";

export default function Search() {
  const router = useRouter();
  const {language} = useLanguage();
  const {currentDuas, currentCategories} = useDuaLoader();

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
        <SearchEngine
          data={currentDuas}
          categoriesData={currentCategories}
          language={language}
          onSelectDua={handleSelectDua}
          debounceMs={250}
          emptyQueryReturnsAll
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
});
