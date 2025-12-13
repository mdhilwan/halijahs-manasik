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
  "talbiyah.mp3": require("@/assets/audio/talbiyah.mp3"), // doa pendek
  "niat_solat_sunat_ihram.mp3": require("@/assets/audio/niat_solat_sunat_ihram.mp3"),
  "niat_ihram_umrah.mp3": require("@/assets/audio/niat_ihram_umrah.mp3"),
  "niat_umrah_badal.mp3": require("@/assets/audio/niat_umrah_badal.mp3"),
  "niat_umrah_bersyarat.mp3": require("@/assets/audio/niat_umrah_bersyarat.mp3"),
  "niat_ihram_haji.mp3": require("@/assets/audio/niat_ihram_haji.mp3"),
  "niat_haji_badal.mp3": require("@/assets/audio/niat_haji_badal.mp3"),
  "niat_haji_bersyarat.mp3": require("@/assets/audio/niat_haji_bersyarat.mp3"),
  "doa_memasuki_masjidil_haram.mp3": require("@/assets/audio/doa_memasuki_masjidil_haram.mp3"),
  "doa_ketika_melihat_kaabah.mp3": require("@/assets/audio/doa_ketika_melihat_kaabah.mp3"),
  "doa_sebelum_memulakan_tawaf.mp3": require("@/assets/audio/doa_sebelum_memulakan_tawaf.mp3"),
  "niat_tawaf_qudum.mp3": require("@/assets/audio/niat_tawaf_qudum.mp3"),
  "niat_tawaf_haji.mp3": require("@/assets/audio/niat_tawaf_haji.mp3"),
  "niat_tawaf_umrah.mp3": require("@/assets/audio/niat_tawaf_umrah.mp3"),
  "niat_tawaf_sunnah.mp3": require("@/assets/audio/niat_tawaf_sunnah.mp3"),
  "niat_tawaf_wada.mp3": require("@/assets/audio/niat_tawaf_wada.mp3"),
  "doa_dari_rukun_yamani_hingga_hajar_aswad.mp3": require("@/assets/audio/doa_dari_rukun_yamani_hingga_hajar_aswad.mp3"),
  "doa_tawaf_pusingan_pertama.mp3": require("@/assets/audio/doa_tawaf_pusingan_pertama.mp3"),
  "doa_tawaf_pusingan_kedua.mp3": require("@/assets/audio/doa_tawaf_pusingan_kedua.mp3"),
  "doa_tawaf_pusingan_ketiga.mp3": require("@/assets/audio/doa_tawaf_pusingan_ketiga.mp3"),
  "doa_tawaf_pusingan_keempat.mp3": require("@/assets/audio/doa_tawaf_pusingan_keempat.mp3"),
  "doa_tawaf_pusingan_kelima.mp3": require("@/assets/audio/doa_tawaf_pusingan_kelima.mp3"),
  "doa_tawaf_pusingan_keenam.mp3": require("@/assets/audio/doa_tawaf_pusingan_keenam.mp3"),
  "doa_tawaf_pusingan_ketujuh.mp3": require("@/assets/audio/doa_tawaf_pusingan_ketujuh.mp3"),
  "niat_solat_sunnat_tawaf.mp3": require("@/assets/audio/niat_solat_sunnat_tawaf.mp3"),
  "doa_setelah_solat_sunat_tawaf.mp3": require("@/assets/audio/doa_setelah_solat_sunat_tawaf.mp3"),
  "doa_ketika_minum_air_zamzam.mp3": require("@/assets/audio/doa_ketika_minum_air_zamzam.mp3"),
  "niat_sai_haji.mp3": require("@/assets/audio/niat_sai_haji.mp3"),
  "niat_sai_umrah.mp3": require("@/assets/audio/niat_sai_umrah.mp3"),
  "doa_memulakan_sai.mp3": require("@/assets/audio/doa_memulakan_sai.mp3"),
  "doa_antara_tiang_hijau.mp3": require("@/assets/audio/doa_antara_tiang_hijau.mp3"),
  "doa_setelah_melintas_tiang_hijau.mp3": require("@/assets/audio/doa_setelah_melintas_tiang_hijau.mp3"),
  "doa_naik_bukit_safa_marwah.mp3": require("@/assets/audio/doa_naik_bukit_safa_marwah.mp3"),
  "doa_sai_pertama.mp3": require("@/assets/audio/doa_sai_pertama.mp3"),
  "doa_sai_kedua.mp3": require("@/assets/audio/doa_sai_kedua.mp3"),
  "doa_sai_ketiga.mp3": require("@/assets/audio/doa_sai_ketiga.mp3"),
  "doa_sai_keempat.mp3": require("@/assets/audio/doa_sai_keempat.mp3"),
  "doa_sai_kelima.mp3": require("@/assets/audio/doa_sai_kelima.mp3"),
  "doa_sai_keenam.mp3": require("@/assets/audio/doa_sai_keenam.mp3"),
  "doa_sai_ketujuh.mp3": require("@/assets/audio/doa_sai_ketujuh.mp3"),
  "doa_selesai_sai.mp3": require("@/assets/audio/doa_selesai_sai.mp3"),
  "doa_ketika_bercukur.mp3": require("@/assets/audio/doa_ketika_bercukur.mp3"),
  "doa_setelah_bercukur.mp3": require("@/assets/audio/doa_setelah_bercukur.mp3"),
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
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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

  const loadAudio = async () => {
    if (!dua?.audio) return;
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const {sound: newSound, status} = await Audio.Sound.createAsync(
        audioMap[dua.audio],
        {shouldPlay: false},
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
        {prevAvailable &&
          <TouchableOpacity
            style={[styles.audioButton, {marginRight: 20, backgroundColor: "white"}]}
            onPress={() => {
              if (selectedDua?.curr !== undefined) {
                setSelectedDua({
                  curr: selectedDua.curr - 1,
                  duas: selectedDua.duas
                })
              }
            }}
          >
            <Ionicons name="play-skip-back" size={28} color={"black"}/>
          </TouchableOpacity>}
        {dua?.audio &&
            <TouchableOpacity
                style={[styles.audioButton, {
                  backgroundColor: "black",
                  borderRadius: "100%",
                  borderStyle: "solid",
                  borderColor: "black"
                }]}
                onPress={handlePlayPause}
                disabled={loading}
            >
              {loading
                ? <Ionicons name="time" size={28} color="white"/>
                : isPlaying
                  ? <Ionicons name="pause" size={28} color="white"/>
                  : <Ionicons name="play" size={28} color="white"/>}
            </TouchableOpacity>
        }
        {nextAvailable && <TouchableOpacity
          style={[styles.audioButton, {marginLeft: 20, backgroundColor: "white"}]}
          onPress={() => {
            if (selectedDua?.curr !== undefined) {
              setSelectedDua({
                curr: selectedDua.curr + 1,
                duas: selectedDua.duas
              })
            }
          }}
        >
          <Ionicons name="play-skip-forward" size={28} color={"black"}/>
        </TouchableOpacity>}
      </View>
      {dua?.audio &&
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
      }
    </View>
  );
}

const styles = StyleSheet.create({
  audioButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    color: Colors.light.tint
  },
  buttonText: {color: '#ffd65c', fontSize: 20, textAlign: 'center'},
});