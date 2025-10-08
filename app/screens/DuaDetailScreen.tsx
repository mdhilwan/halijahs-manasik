import React, {useState} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Audio} from 'expo-av';
import {DuaDetailType, DuaType, SelectedDuaType} from "@/app/types";

const audioMap: Record<string, any> = {
  "talbiyah.mp3": require("../../assets/audio/talbiyah.mp3"),
};

type PlayStopButtonType = {
  dua: DuaType;
}

function PlayStopButton({dua}: PlayStopButtonType) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  return <>
    {
      hasNext() && <TouchableOpacity
            style={styles.audioButton}
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
    }
    {
      hasPrev() && <TouchableOpacity
            style={styles.audioButton}
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
    }
  </>
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
  arabic: {fontSize: 28, textAlign: 'center', marginVertical: 20, color: '#333'},
  translation: {fontSize: 18, textAlign: 'center', color: '#555'},
  audioButton: {backgroundColor: '#00796b', padding: 16, borderRadius: 10, marginTop: 20},
  buttonText: {color: '#fff', fontSize: 20, textAlign: 'center'},
  back: {fontSize: 18, color: '#00796b', marginBottom: 10},
});