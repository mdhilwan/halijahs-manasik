import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import { AudioMap } from '@/components/controls/audio-files';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AudioState {
  sound: Audio.Sound | null;
  loading: boolean;
  isPlaying: boolean;
  isLooping: boolean;
  duration: number;
  position: number;
  isSeeking: boolean;
}

interface AudioActions {
  loadAudio: (audioKey: string) => Promise<void>;
  handlePlayPause: () => Promise<void>;
  handleSeek: (value: number) => Promise<void>;
  toggleLooping: () => Promise<void>;
}

interface AudioContextType extends AudioState, AudioActions {}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const positionRef = useRef<number>(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isLoopingRef = useRef<boolean>(false);

  const LOOPING_STORAGE_KEY = 'dua_player_is_looping';

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);

  useEffect(() => {
    let cancelled = false;
    const loadLooping = async () => {
      try {
        const saved = await AsyncStorage.getItem(LOOPING_STORAGE_KEY);
        if (cancelled) return;
        if (saved !== null) {
          setIsLooping(saved === 'true');
        }
      } catch (err) {
        console.warn('Error loading looping setting:', err);
      }
    };
    loadLooping();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sound) return;
    sound.setIsLoopingAsync(isLooping).catch(() => {
      // sound may have been unloaded
    });
  }, [sound, isLooping]);

  useEffect(() => {
    return () => {
      const s = soundRef.current;
      if (s) {
        s.stopAsync().catch(() => {});
        s.unloadAsync().catch(() => {});
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Stop audio when navigating away from the screen that owns this provider.
        // (Does NOT stop on lock-screen/background.)
        const s = soundRef.current;
        if (s) {
          s.stopAsync().catch(() => {});
        }
        setIsPlaying(false);
        setPosition(0);
      };
    }, [])
  );

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
      if (status.didJustFinish && !status.isLooping) {
        setIsPlaying(false);
        setPosition(0);
        positionRef.current = 0;

        // Expo-AV keeps the native position at the end when finished.
        // Resetting it ensures the next play starts from the beginning.
        const s = soundRef.current;
        if (s) {
          s.setPositionAsync(0).catch(() => {});
        }
      }
    }
  };

  const loadAudio = async (audioKey: string) => {
    if (!audioKey) return;
    setLoading(true);
    try {
      setIsPlaying(false);
      setPosition(0);
      positionRef.current = 0;
      setDuration(0);

      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        AudioMap[audioKey],
        { shouldPlay: false, isLooping: isLoopingRef.current },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      if (status.isLoaded) {
        setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
        setPosition(status.positionMillis ? status.positionMillis / 1000 : 0);
      }
    } catch (e) {
      console.warn('Error loading audio:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleLooping = async () => {
    const next = !isLoopingRef.current;
    isLoopingRef.current = next;
    setIsLooping(next);

    try {
      await AsyncStorage.setItem(LOOPING_STORAGE_KEY, String(next));
    } catch (err) {
      console.warn('Error saving looping setting:', err);
    }

    const s = soundRef.current;
    if (s) {
      try {
        await s.setIsLoopingAsync(next);
      } catch {
        // sound might not be loaded yet
      }
    }
  };

  const handlePlayPause = async () => {
    if (loading) return;
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            // If playback has completed, playAsync() may immediately finish again.
            // Detect "ended" and explicitly replay from the beginning.
            const END_TOLERANCE_MS = 500;
            const durationMs = status.durationMillis ?? 0;
            const positionMs = status.positionMillis ?? 0;
            const ended =
              status.didJustFinish ||
              (durationMs > 0 && positionMs >= Math.max(0, durationMs - END_TOLERANCE_MS));

            if (ended && !status.isLooping) {
              await sound.replayAsync();
            } else {
              await sound.playAsync();
            }
            setIsPlaying(true);
          }
        }
      } catch {
        console.warn('Sound not loaded');
      }
    } else {
      console.warn('No sound loaded');
    }
  };

  const handleSeek = async (value: number) => {
    setIsSeeking(true);
    setPosition(value);
    if (sound) {
      try {
        await sound.setPositionAsync(value * 1000);
      } catch {
        console.warn('Sound not loaded for seeking');
      }
    }
    setIsSeeking(false);
  };

  const value: AudioContextType = {
    sound,
    loading,
    isPlaying,
    isLooping,
    duration,
    position,
    isSeeking,
    loadAudio,
    handlePlayPause,
    handleSeek,
    toggleLooping,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
