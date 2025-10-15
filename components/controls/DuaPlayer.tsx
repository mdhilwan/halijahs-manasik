import React, {useEffect, useRef, useState} from "react";
import {Audio} from "expo-av";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Slider from "@react-native-community/slider";
import {Colors} from "@/constants/theme";
import {PlayStopButtonType} from "@/app/types";
import Ionicons from '@expo/vector-icons/Ionicons';

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const audioMap: Record<string, any> = {
  "talbiyah.mp3": require("@/assets/audio/talbiyah.mp3"),
};

export const DuaPlayer = ({dua, setSelectedDua, selectedDua}: PlayStopButtonType) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const positionRef = useRef<number>(0);

  const hasNext = () => {
    return selectedDua && selectedDua.curr !== undefined && selectedDua.duas[selectedDua.curr + 1] !== undefined
  }

  const hasPrev = () => {
    return selectedDua && selectedDua.curr !== undefined && selectedDua.duas[selectedDua.curr - 1] !== undefined
  }

  const nextAvailable = hasNext();
  const prevAvailable = hasPrev();

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
    if (dua?.audio) {
      loadAudio();
    }
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dua?.audio]);

  if (!dua?.audio) return <></>;

  const loadAudio = async () => {
    if (!dua?.audio) return;
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        audioMap[dua.audio],
        { shouldPlay: false }, // 👈 preloaded but not playing
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      if (status.isLoaded) {
        setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
        setPosition(status.positionMillis ? status.positionMillis / 1000 : 0);
      }
    } catch (e) {
      console.warn('Error loading audio:', e);
    }
  };

  const loadAndPlay = async () => {
    if (!sound) {
      await loadAudio();
    }
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
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

  const handleSeek = async (value: number) => {
    setIsSeeking(true);
    setPosition(value);
    if (sound) {
      await sound.setPositionAsync(value * 1000);
    }
    setIsSeeking(false);
  };

  return (
    <View style={{alignItems: 'center'}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
            style={[styles.audioButton, {marginRight: 20, backgroundColor: "white"}]}
            onPress={() => {
              if (selectedDua?.curr !== undefined && prevAvailable) {
                setSelectedDua({
                  curr: selectedDua.curr - 1,
                  duas: selectedDua.duas
                })
              }
            }}
        >
            <Ionicons name="play-skip-back" size={28} color={prevAvailable ? "black" : "#989898"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.audioButton, {backgroundColor: "black", borderRadius: "100%", borderStyle: "solid", borderColor: "black"}]}
          onPress={handlePlayPause}
          disabled={loading}
        >
            {loading
              ? <Ionicons name="time" size={28} color="white" />
              : isPlaying
                ? <Ionicons name="pause" size={28} color="white" />
                : <Ionicons name="play" size={28} color="white" />}
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.audioButton, {marginLeft: 20, backgroundColor: "white"}]}
            onPress={() => {
              if (selectedDua?.curr !== undefined && nextAvailable) {
                setSelectedDua({
                  curr: selectedDua.curr + 1,
                  duas: selectedDua.duas
                })
              }
            }}
        >
            <Ionicons name="play-skip-forward" size={28} color={nextAvailable ? "black" : "#989898"} />
        </TouchableOpacity>
      </View>
      <View style={{width: '100%', marginTop: 5, alignItems: 'center'}}>
        <Slider
          style={{width: "100%", height: 40}}
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: "100%"}}>
          <Text style={{fontSize: 14, color: '#555'}}>{formatTime(position)}</Text>
          <Text style={{fontSize: 14, color: '#555'}}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  audioButton: {backgroundColor: Colors.light.tint, padding: 10, borderRadius: 10, marginTop: 10, color: Colors.light.tint},
  buttonText: {color: '#ffd65c', fontSize: 20, textAlign: 'center'},
});