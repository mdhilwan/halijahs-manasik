import React from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, TouchableOpacity, StyleSheet, View, ScrollView} from 'react-native';
import {DuaDetailType, DuaEngMalayArabicType, DuaType} from "@/app/types";
import {useFonts} from "expo-font";
import {DuaPlayer} from "@/components/controls/DuaPlayer";

export default function DuaDetailScreen({setScreen, selectedDua, setSelectedDua}: DuaDetailType) {

  const duaObj = selectedDua?.duas[selectedDua.curr as number]
  useFonts({
    'Uthman-Taha-Naskh': require('@/assets/font/KFGQPC-Uthman-Taha-Naskh-Regular.ttf'),
  });

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
      <ScrollView>
        {
          duaObj &&
            <>
                <Text style={styles.title}>{duaObj.titleEn}</Text>
                {
                  duaObj.doa.map((dua: DuaEngMalayArabicType) => <Text key={dua.id}>
                    <View style={styles.textWrapper}>
                      <Text style={styles.arabic}>{dua.arabic}</Text>
                    </View>
                    <View style={styles.textWrapper}>
                      <Text style={styles.translation}>{dua.translationEn}</Text>
                    </View>

                  </Text>)
                }
            </>
        }
      </ScrollView>
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
    marginVertical: 20
  },
  textWrapper: {
    marginRight: 5,
    marginBottom: 5,
    flexShrink: 1,
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