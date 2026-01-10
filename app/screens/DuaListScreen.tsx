import React from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, TouchableOpacity, ScrollView, View, StyleSheet} from 'react-native';
import {DuaListScreenType} from "@/app/types";
import {Colors} from "@/constants/theme";
import {useLanguage} from "@/app/contexts/LanguageContext";
import {LanguageEnums} from "@/constants/language-enums";
import {Ionicons} from "@expo/vector-icons";
import {useFonts} from "expo-font";

export default function DuaListScreen({setScreen, duas, setSelectedDua, category}: DuaListScreenType) {
  const {language} = useLanguage()
  const [fontLoaded] = useFonts({
    'Mulish-Bold': require('@/assets/font/Mulish-Bold.ttf'),
  });
  return (
    fontLoaded && <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => setScreen("home")}>
                <Ionicons size={28} name={"chevron-back"} color={"black"}/>
            </TouchableOpacity>
        </View>
        <Text style={styles.title}>{category} Du&#39;a List</Text>
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
              <Text style={styles.listText}>{language === LanguageEnums.EN ? dua.titleEn : dua.titleMy}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
    </SafeAreaView>
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
    color: '#505050',
  },
  container: {flex: 1, backgroundColor: '#fff', padding: 20},
  title: {fontSize: 26, fontFamily: 'Mulish-Bold', textAlign: 'center', marginVertical: 20},
  listItem: {backgroundColor: Colors.light.tint, padding: 20, marginVertical: 8, borderRadius: 10},
  listText: {fontSize: 18, fontFamily: 'Mulish-Bold', color: Colors.base.tint, textTransform: 'capitalize'},
  back: {fontSize: 18, color: '#505050', marginBottom: 10},
});