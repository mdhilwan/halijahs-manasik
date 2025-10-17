import React from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, TouchableOpacity, StyleSheet, View, ScrollView} from 'react-native';
import {DuaDetailType, DuaEngMalayArabicType, DuaType} from "@/app/types";
import {useFonts} from "expo-font";
import {DuaPlayer} from "@/components/controls/DuaPlayer";
import {useLanguage} from "@/app/contexts/LanguageContext";

function ArabicText({dua}: {dua: DuaEngMalayArabicType}) {
  if (dua.arabic === "") {
    return null
  }
  return <View style={styles.textWrapper}>
    <Text style={styles.arabic}>{dua.arabic}</Text>
  </View>
}

function TranslationText({dua, translationKey}: {dua: DuaEngMalayArabicType, translationKey: "translationMy" | "translationEn"}) {
  if (dua[translationKey].length === 0) {
    return null
  }
  return <View style={styles.textWrapper}>
    {typeof dua[translationKey] === "string" ?
      <Text style={styles.translation}>
        {dua[translationKey]}
      </Text> :
      <Text style={styles.textWrapper}>
        {dua[translationKey].map((duaLine: string, index: number) =>
          <Text key={index} style={[styles.translation, {textAlign: "left"}]}>
            • {duaLine + '\n'}
          </Text>
        )}
      </Text>}
  </View>
}

export default function DuaDetailScreen({setScreen, selectedDua, setSelectedDua}: DuaDetailType) {

  const {language} = useLanguage();
  const duaObj = selectedDua?.duas[selectedDua.curr as number]
  const [fontLoaded] = useFonts({
    'Uthman-Taha-Naskh': require('@/assets/font/KFGQPC-Uthman-Taha-Naskh-Regular.ttf'),
  });

  if (!fontLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading fonts...</Text>
      </SafeAreaView>
    );
  }

  const titleKey= language === 'my' ? "titleMy" : "titleEn"
  const translationKey = language === 'my' ? "translationMy" : "translationEn"

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => {
        if (selectedDua?.duas.length === 1) {
          setScreen('home')
        } else {
          setScreen('duaList')
        }
      }}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
      {
        (duaObj) &&
          <>
              <Text style={styles.title}>{duaObj[titleKey]}</Text>
              <ScrollView>
                {
                  duaObj.doa.map((dua: DuaEngMalayArabicType) => {
                    return <Text key={dua.id}>
                      <ArabicText dua={dua} />
                      <TranslationText dua={dua} translationKey={translationKey} />
                    </Text>
                  })
                }
              </ScrollView>
          </>
      }
      <DuaPlayer dua={duaObj as DuaType} selectedDua={selectedDua} setSelectedDua={setSelectedDua}/>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  textWrapper: {
    marginRight: 5,
    marginBottom: 5,
    flexShrink: 1,
    paddingHorizontal: 1
  },
  arabic: {
    fontSize: 34,
    fontFamily: "Uthman-Taha-Naskh",
    textAlign: 'center',
    marginVertical: 20,
    color: '#333'
  },
  translation: {
    fontSize: 20,
    textAlign: 'center',
    color: '#555'
  },
  back: {fontSize: 18, color: '#505050', marginBottom: 10},
});