import {StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import {useFontSize} from "@/app/contexts/FontSettingsContext";
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";

const TextSettings = ({children}: { children: React.ReactNode }) => {
  return <ThemedText style={styles.settingsText}>{children}</ThemedText>;
}

export const SettingsView = () => {
  const { arabicFontSize, translationFontSize, setTranslationFontSize, setArabicFontSize } = useFontSize()

  return <>
    <ThemedView style={styles.settingRow}>
      <TextSettings>Arabic Dua size: <ThemedText style={{color: "#999"}}>{arabicFontSize}</ThemedText></TextSettings>
      <ThemedView style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setArabicFontSize(arabicFontSize + 2)}><TextSettings>+</TextSettings></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setArabicFontSize(36)}><TextSettings>Default</TextSettings></TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setArabicFontSize(Math.max(20, arabicFontSize - 2))}><TextSettings>-</TextSettings></TouchableOpacity>
      </ThemedView>
    </ThemedView>

    <ThemedView style={styles.settingRow}>
      <TextSettings>Translation size <ThemedText style={{color: "#999"}}>{translationFontSize}</ThemedText></TextSettings>
      <ThemedView style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => setTranslationFontSize(translationFontSize + 2)}><TextSettings>+</TextSettings></TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setTranslationFontSize(24)}><TextSettings>Default</TextSettings></TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setTranslationFontSize(Math.max(20, translationFontSize - 2))}><TextSettings>-</TextSettings></TouchableOpacity>
      </ThemedView>
    </ThemedView>
  </>
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  settingsText: {
    fontSize: 18,
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});