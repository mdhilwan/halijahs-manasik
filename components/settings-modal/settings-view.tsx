import {StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import {
  MAX_ARABIC_FONT_SIZE,
  MAX_TRANSLATION_FONT_SIZE,
  MIN_ARABIC_FONT_SIZE, MIN_TRANSLATION_FONT_SIZE,
  useFontSize
} from "@/contexts/FontSettingsContext";
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";

const TextSettings = ({children}: { children: React.ReactNode }) => {
  return <ThemedText style={styles.settingsText}>{children}</ThemedText>;
}

export const SettingsView = () => {
  const { arabicFontSize, translationFontSize, setTranslationFontSize, setArabicFontSize } = useFontSize()

  const arabicAtMax = arabicFontSize >= MAX_ARABIC_FONT_SIZE;
  const arabicAtMin = arabicFontSize <= MIN_ARABIC_FONT_SIZE;
  const translationAtMax = translationFontSize >= MAX_TRANSLATION_FONT_SIZE;
  const translationAtMin = translationFontSize <= MIN_TRANSLATION_FONT_SIZE;

  return <>
    <ThemedView style={styles.settingRow}>
      <TextSettings>Arabic Dua size: <ThemedText style={{color: "#999"}}>{arabicFontSize}</ThemedText></TextSettings>
      <ThemedView style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, arabicAtMax && styles.buttonDisabled]}
          disabled={arabicAtMax}
          onPress={() => setArabicFontSize(Math.min(MAX_ARABIC_FONT_SIZE, arabicFontSize + 2))}
        >
          <TextSettings>+</TextSettings>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setArabicFontSize(36)}><TextSettings>Default</TextSettings></TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, arabicAtMin && styles.buttonDisabled]}
          disabled={arabicAtMin}
          onPress={() => setArabicFontSize(Math.max(MIN_ARABIC_FONT_SIZE, arabicFontSize - 2))}
        >
          <TextSettings>-</TextSettings>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>

    <ThemedView style={styles.settingRow}>
      <TextSettings>Translation size <ThemedText style={{color: "#999"}}>{translationFontSize}</ThemedText></TextSettings>
      <ThemedView style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, translationAtMax && styles.buttonDisabled]}
          disabled={translationAtMax}
          onPress={() => setTranslationFontSize(Math.min(MAX_TRANSLATION_FONT_SIZE, translationFontSize + 2))}
        >
          <TextSettings>+</TextSettings>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setTranslationFontSize(24)}><TextSettings>Default</TextSettings></TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, translationAtMin && styles.buttonDisabled]}
          disabled={translationAtMin}
          onPress={() => setTranslationFontSize(Math.max(MIN_TRANSLATION_FONT_SIZE, translationFontSize - 2))}
        >
          <TextSettings>-</TextSettings>
        </TouchableOpacity>
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
  buttonDisabled: {
    opacity: 0.4,
  },
});