import React, {useState} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import {Audio} from 'expo-av';
import {DuaDetailType, DuaType, SelectedDuaType} from "@/app/types";
import {useFonts} from "expo-font";
import {Colors} from "@/constants/theme";

const audioMap: Record<string, any> = {
  "talbiyah.mp3": require("@/assets/audio/talbiyah.mp3"),
};

type PlayStopButtonType = {
  dua: DuaType;
}

function PlayStopButton({dua}: PlayStopButtonType) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fontsLoaded] = useFonts({
    'NotoNaskhArabic-Regular': require('@/assets/font/NotoNaskhArabic-Regular.ttf'),
    'NotoNaskhArabic-Bold': require('@/assets/font/NotoNaskhArabic-Bold.ttf'),
  });

  if (!dua.audio) return <></>

  const playAudio = async (audioFileName: string) => {
    if (!loading) {
      setLoading(true)
      if (sound) await sound.unloadAsync();
      const {sound: newSound} = await Audio.Sound.createAsync(audioMap[audioFileName]);
      setSound(newSound);
      await newSound.playAsync();
      setLoading(false)
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  if (loading) {
    return <TouchableOpacity
      style={styles.audioButton}
    >
      <Text style={styles.buttonText}>Loading...</Text>
    </TouchableOpacity>
  } else if (sound) {
    return <TouchableOpacity
      style={styles.audioButton}
      onPress={stopAudio}
    >
      <Text style={styles.buttonText}>⏹️ Stop Audio</Text>
    </TouchableOpacity>
  } else if (!sound) {
    return <TouchableOpacity
      style={styles.audioButton}
      onPress={() => playAudio(dua.audio)}
    >
      <Text style={styles.buttonText}>▶️ Play Audio</Text>
    </TouchableOpacity>
  }
}

function NavButton({selectedDua, setSelectedDua}: {
  selectedDua: SelectedDuaType,
  setSelectedDua: React.Dispatch<React.SetStateAction<SelectedDuaType>>
}) {
  const hasNext = () => {
    return selectedDua && selectedDua.curr !== undefined && selectedDua.duas[selectedDua.curr + 1] !== undefined
  }

  const hasPrev = () => {
    return selectedDua && selectedDua.curr !== undefined && selectedDua.duas[selectedDua.curr - 1] !== undefined
  }

  const nextAvailable = hasNext();
  const prevAvailable = hasPrev();

  if (nextAvailable && prevAvailable) {
    return (
      <View style={styles.navButtonContainer}>
        <TouchableOpacity
          style={[styles.audioButton, {width: '48%'}]}
          onPress={() => {
            if (selectedDua?.curr !== undefined) {
              setSelectedDua({
                curr: selectedDua.curr - 1,
                duas: selectedDua.duas
              })
            }
          }}
        >
          <Text style={styles.buttonText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.audioButton, {width: '48%'}]}
          onPress={() => {
            if (selectedDua?.curr !== undefined) {
              setSelectedDua({
                curr: selectedDua.curr + 1,
                duas: selectedDua.duas
              })
            }
          }}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    )
  } else if (nextAvailable) {
    return (
      <TouchableOpacity
        style={[styles.audioButton, {width: '100%'}]}
        onPress={() => {
          if (selectedDua?.curr !== undefined) {
            setSelectedDua({
              curr: selectedDua.curr + 1,
              duas: selectedDua.duas
            })
          }
        }}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    )
  } else if (prevAvailable) {
    return (
      <TouchableOpacity
        style={[styles.audioButton, {width: '100%'}]}
        onPress={() => {
          if (selectedDua?.curr !== undefined) {
            setSelectedDua({
              curr: selectedDua.curr - 1,
              duas: selectedDua.duas
            })
          }
        }}
      >
        <Text style={styles.buttonText}>Prev</Text>
      </TouchableOpacity>
    )
  } else {
    return null;
  }
}

export default function DuaDetailScreen({setScreen, selectedDua, setSelectedDua}: DuaDetailType) {

  const dua = selectedDua?.duas[selectedDua.curr as number]

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setScreen('duaList')}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      {
        dua &&
          <>
              <Text style={styles.title}>{dua.title}</Text>
              <Text style={styles.arabic}>{dua.arabic}</Text>
              <Text style={styles.translation}>{dua.translation}</Text>

              <PlayStopButton dua={dua}/>
              <NavButton selectedDua={selectedDua} setSelectedDua={setSelectedDua}/>
          </>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  title: {fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 20},
  arabic: {fontSize: 28, fontFamily: "NotoNaskhArabic-Regular", textAlign: 'center', marginVertical: 20, color: '#333'},
  translation: {fontSize: 18, textAlign: 'center', color: '#555'},
  audioButton: {backgroundColor: Colors.light.tint, padding: 16, borderRadius: 10, marginTop: 20},
  buttonText: {color: '#ffd65c', fontSize: 20, textAlign: 'center'},
  back: {fontSize: 18, color: '#505050', marginBottom: 10},
  navButtonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
});