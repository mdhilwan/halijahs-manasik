import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {useFontSize} from "@/app/contexts/FontSettingsContext";

const TextSettings = ({children}: { children: React.ReactNode }) => {
  return <Text style={styles.settingsText}>{children}</Text>
}

export const SettingsView = () => {
  const { arabicFontSize, translationFontSize, setTranslationFontSize, setArabicFontSize } = useFontSize()

  return <>
    <View style={styles.settingRow}>
      <TextSettings>Arabic Dua size: <Text style={{color: "#999"}}>{arabicFontSize}</Text></TextSettings>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setArabicFontSize(arabicFontSize + 2)}><TextSettings>+</TextSettings></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setArabicFontSize(36)}><TextSettings>Default</TextSettings></TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setArabicFontSize(Math.max(20, arabicFontSize - 2))}><TextSettings>-</TextSettings></TouchableOpacity>
      </View>
    </View>

    <View style={styles.settingRow}>
      <TextSettings>Translation size <Text style={{color: "#999"}}>{translationFontSize}</Text></TextSettings>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => setTranslationFontSize(translationFontSize + 2)}><TextSettings>+</TextSettings></TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setTranslationFontSize(24)}><TextSettings>Default</TextSettings></TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setTranslationFontSize(Math.max(20, translationFontSize - 2))}><TextSettings>-</TextSettings></TouchableOpacity>
      </View>
    </View>
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