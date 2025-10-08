import React, {useState} from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { DuaDetailType } from "@/app/types";

const audioMap: Record<string, any> = {
  "talbiyah.mp3": require("../../assets/audio/talbiyah.mp3"),
};

type PlayStopButtonType = {
  selectedDua: any;
}

function PlayStopButton({selectedDua}: PlayStopButtonType) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const playAudio = async (audioFileName: string) => {
    if (!loading) {
      setLoading(true)
      if (sound) await sound.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync(audioMap[audioFileName]);
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
      onPress={() => playAudio(selectedDua.audio)}
    >
      <Text style={styles.buttonText}>▶️ Play Audio</Text>
    </TouchableOpacity>
  }
}

export default function DuaDetailScreen({ setScreen, selectedDua }: DuaDetailType) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setScreen('duaList')}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{selectedDua.title}</Text>
      <Text style={styles.arabic}>{selectedDua.arabic}</Text>
      <Text style={styles.translation}>{selectedDua.translation}</Text>

      <PlayStopButton selectedDua={selectedDua}/>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  arabic: { fontSize: 28, textAlign: 'center', marginVertical: 20, color: '#333' },
  translation: { fontSize: 18, textAlign: 'center', color: '#555' },
  audioButton: { backgroundColor: '#00796b', padding: 16, borderRadius: 10, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 20, textAlign: 'center' },
  back: { fontSize: 18, color: '#00796b', marginBottom: 10 },
});