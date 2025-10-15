import React, {useState, useRef, useEffect} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, TouchableOpacity, StyleSheet, View, ScrollView} from 'react-native';
import {Audio} from 'expo-av';
import {DuaDetailType, DuaEngMalayArabicType, DuaType, SelectedDuaType} from "@/app/types";
import {useFonts} from "expo-font";
import {Colors} from "@/constants/theme";
import Slider from '@react-native-community/slider';

const audioMap: Record<string, any> = {
  "talbiyah.mp3": require("@/assets/audio/talbiyah.mp3"),
};

type PlayStopButtonType = {
  dua: DuaType;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function PlayStopButton({dua}: PlayStopButtonType) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const positionRef = useRef<number>(0);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Reset progress if dua changes
    setPosition(0);
    setDuration(0);
    setIsPlaying(false);
    setLoading(false);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dua?.audio]);

  if (!dua?.audio) return <></>;

  const loadAndPlay = async () => {
    setLoading(true);
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        audioMap[dua.audio],
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
      setPosition(status.positionMillis ? status.positionMillis / 1000 : 0);
      newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (!isSeeking) {
      if (status.positionMillis !== undefined) {
        setPosition(status.positionMillis / 1000);
        positionRef.current = status.positionMillis / 1000;
      }
      if (status.durationMillis !== undefined) {
        setDuration(status.durationMillis / 1000);
      }
    }
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const handlePlayPause = async () => {
    if (loading) return;
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } else {
      await loadAndPlay();
    }
  };

  const handleStop = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setPosition(0);
    }
  };

  const handleSeek = async (value: number) => {
    setIsSeeking(true);
    setPosition(value);
    if (sound) {
      await sound.setPositionAsync(value * 1000);
    }
    setIsSeeking(false);
  };

  return (
    <View style={{marginTop: 20, alignItems: 'center'}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={handlePlayPause}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? 'Loading...'
              : isPlaying
                  ? '⏸️ Pause'
                  : '▶️ Play'}
          </Text>
        </TouchableOpacity>
        {sound || isPlaying || position > 0 ? (
          <TouchableOpacity
            style={[styles.audioButton, {marginLeft: 10, backgroundColor: '#e74c3c'}]}
            onPress={handleStop}
          >
            <Text style={styles.buttonText}>⏹️ Stop</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {(sound || position > 0 || duration > 0) && (
        <View style={{width: '100%', marginTop: 10, alignItems: 'center'}}>
          <Slider
            style={{width: 250, height: 40}}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingStart={() => setIsSeeking(true)}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#ffd65c"
            maximumTrackTintColor="#ddd"
            thumbTintColor={Colors.light.tint}
            disabled={loading || !sound}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 250}}>
            <Text style={{fontSize: 14, color: '#555'}}>{formatTime(position)}</Text>
            <Text style={{fontSize: 14, color: '#555'}}>{formatTime(duration)}</Text>
          </View>
        </View>
      )}
    </View>
  );
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

  const duaObj = selectedDua?.duas[selectedDua.curr as number]
  useFonts({
    'NotoNaskhArabic-Regular': require('@/assets/font/NotoNaskhArabic-Regular.ttf'),
    'NotoNaskhArabic-Bold': require('@/assets/font/NotoNaskhArabic-Bold.ttf'),
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
      <PlayStopButton dua={duaObj as DuaType}/>
      <NavButton selectedDua={selectedDua} setSelectedDua={setSelectedDua}/>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  audioButton: {backgroundColor: Colors.light.tint, padding: 16, borderRadius: 10, marginTop: 20},
  buttonText: {color: '#ffd65c', fontSize: 20, textAlign: 'center'},
  back: {fontSize: 18, color: '#505050', marginBottom: 10},
  navButtonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
});