import {StyleSheet, Switch, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {useFontSize} from "@/app/contexts/FontSettingsContext";

const TextSettings = ({children}: { children: React.ReactNode }) => {
  return <Text style={styles.settingsText}>{children}</Text>
}

export const SettingsView = () => {
  const { arabicFontSize, translationFontSize, setTranslationFontSize, setArabicFontSize, translationHidden, setHideTranslation, duaHidden, setHideDua } = useFontSize()

  return <>
    <View style={styles.settingRow}>
      <TextSettings>Arabic Dua size: {arabicFontSize}</TextSettings>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => setArabicFontSize(arabicFontSize + 2)}><TextSettings>+</TextSettings></TouchableOpacity>
        <TouchableOpacity onPress={() => setArabicFontSize(36)}><TextSettings>Default</TextSettings></TouchableOpacity>
        <TouchableOpacity
          onPress={() => setArabicFontSize(Math.max(20, arabicFontSize - 2))}><TextSettings>-</TextSettings></TouchableOpacity>
      </View>
    </View>

    <View style={styles.settingRow}>
      <TextSettings>Translation size {translationFontSize}</TextSettings>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setTranslationFontSize(translationFontSize + 2)}><TextSettings>+</TextSettings></TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTranslationFontSize(24)}><TextSettings>Default</TextSettings></TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTranslationFontSize(Math.max(20, translationFontSize - 2))}><TextSettings>-</TextSettings></TouchableOpacity>
      </View>
    </View>

    {/*<View style={styles.toggleRow}>*/}
    {/*  <TextSettings>Hide Translation</TextSettings>*/}
    {/*  <Switch value={translationHidden} onValueChange={setHideTranslation}/>*/}
    {/*</View>*/}

    {/*<View style={styles.toggleRow}>*/}
    {/*  <TextSettings>Hide Dua</TextSettings>*/}
    {/*  <Switch value={duaHidden} onValueChange={setHideDua}/>*/}
    {/*</View>*/}

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
});