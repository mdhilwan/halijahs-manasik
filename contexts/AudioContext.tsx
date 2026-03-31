import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import { AudioMap } from '@/components/controls/audio-files';

interface AudioState {
  sound: Audio.Sound | null;
  loading: boolean;
  isPlaying: boolean;
  duration: number;
  position: number;
  isSeeking: boolean;
}

interface AudioActions {
  loadAudio: (audioKey: string) => Promise<void>;
  handlePlayPause: () => Promise<void>;
  handleSeek: (value: number) => Promise<void>;
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
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const positionRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      return async () => {
        if (sound) {
          try {
            await sound.stopAsync();
          } catch (e) {
            // sound not loaded or already unloaded
          }
          setIsPlaying(false);
          setPosition(0);
        }
      };
    }, [sound])
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
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const loadAudio = async (audioKey: string) => {
    if (!audioKey) return;
    setLoading(true);
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        AudioMap[audioKey],
        { shouldPlay: false },
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
            await sound.playAsync();
            setIsPlaying(true);
          }
        }
      } catch (e) {
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
      } catch (e) {
        console.warn('Sound not loaded for seeking');
      }
    }
    setIsSeeking(false);
  };

  const value: AudioContextType = {
    sound,
    loading,
    isPlaying,
    duration,
    position,
    isSeeking,
    loadAudio,
    handlePlayPause,
    handleSeek,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
