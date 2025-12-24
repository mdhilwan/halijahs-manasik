import React from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, TouchableOpacity, StyleSheet, View, ScrollView} from 'react-native';
import {DuaDetailType, DuaEngMalayArabicType, DuaType} from "@/app/types";
import {useFonts} from "expo-font";
import {DuaPlayer} from "@/components/controls/dua-player";
import {useLanguage} from "@/app/contexts/LanguageContext";
import {useFontSize} from "@/app/contexts/FontSettingsContext";
import SettingsModal from "@/components/settings-modal";
import {Ionicons} from "@expo/vector-icons";
import {ThemedText} from "@/components/themed-text";
import {BroadcastIndicator} from "@/components/broadcast-indicator";

function ArabicText({dua}: {dua: DuaEngMalayArabicType}) {
  const {arabicFontSize, duaHidden} = useFontSize()
  if (dua.arabic === "" || duaHidden) {
    return null
  }
  return <View style={styles.textWrapper}>
    <ThemedText type={"arabic"} style={{fontSize: arabicFontSize}}>{dua.arabic}</ThemedText>
  </View>
}

function TranslationText({dua, translationKey}: {dua: DuaEngMalayArabicType, translationKey: "translationMy" | "translationEn"}) {
  const {translationFontSize, translationHidden} = useFontSize()
  if (dua[translationKey].length === 0 || translationHidden) {
    return null
  }
  return <View style={styles.textWrapper}>
    {typeof dua[translationKey] === "string" ?
      <Text style={[styles.translation, {fontSize: translationFontSize}]}>
        {dua[translationKey]}
      </Text> :
      <Text style={styles.textWrapper}>
        {dua[translationKey].map((duaLine: string, index: number) =>
          <Text key={index} style={[styles.translation, {textAlign: "left", fontSize: translationFontSize}]}>
            • {duaLine + '\n'}
          </Text>
        )}
      </Text>}
  </View>
}

export default function DuaDetailScreen({setScreen, selectedDua, setSelectedDua}: DuaDetailType) {

  const {language} = useLanguage();
  const {setShowSettings} = useFontSize()
  const duaObj = selectedDua?.duas[selectedDua.curr as number]
  const [fontLoaded] = useFonts({
    'ScheherazadeNew-Regular': require('@/assets/font/ScheherazadeNew-Regular.ttf'),
    'Mulish-Bold': require('@/assets/font/Mulish-Bold.ttf'),
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (selectedDua?.duas.length === 1) {
            setScreen('home');
          } else {
            setScreen('duaList');
          }
        }}>
          <Ionicons size={28} name={"chevron-back"} color={"black"}/>
        </TouchableOpacity>

        <BroadcastIndicator/>

        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Text style={styles.fontSettings}>Aa</Text>
        </TouchableOpacity>
      </View>
      {
        (duaObj) &&
          <>

              <Text style={styles.title}>{duaObj[titleKey]}</Text>
              <ScrollView>
                {
                  duaObj.doa.map((dua: DuaEngMalayArabicType) => {
                    return <Text key={dua.id}>
                      <ArabicText dua={dua}/>
                      <TranslationText dua={dua} translationKey={translationKey}/>
                    </Text>
                  })
                }
              </ScrollView>
          </>
      }
      <DuaPlayer dua={duaObj as DuaType} selectedDua={selectedDua} setSelectedDua={setSelectedDua}/>

      <SettingsModal/>
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
  drawerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
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
    fontFamily: 'Mulish-Bold',
    marginBottom: 10
  },
  textWrapper: {
    width: "100%",
    marginRight: 5,
    marginBottom: 5,
    flexShrink: 1,
    paddingHorizontal: 1
  },
  translation: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Mulish-Bold',
    textAlign: 'center',
    color: '#000'
  },
  back: {
    fontSize: 18,
    color: '#505050',
    marginBottom: 10
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#222',
  },
  drawer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
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
  closeButton: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007AFF',
    fontSize: 18,
  },
});