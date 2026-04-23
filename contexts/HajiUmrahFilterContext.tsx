import React, { createContext, useContext, useEffect, useState } from 'react';
import { HajjMode } from '@/constants/home-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HajjModeContextType {
  mode: HajjMode;
  setMode: (mode: HajjMode) => void;
  toggleMode: () => void;
}

const HajiUmrahFilterContext = createContext<HajjModeContextType>({
  mode: 'haji',
  setMode: () => {},
  toggleMode: () => {},
});

export const HajiUmrahFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<HajjMode>('haji');
  const STORAGE_KEY = 'haji_mode';

  // Load persisted mode on mount
  useEffect(() => {
    const loadMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedMode === 'haji' || savedMode === 'umrah') {
          setModeState(savedMode as HajjMode);
        }
      } catch (e) {
        console.warn('Error loading hajj mode:', e);
      }
    };
    loadMode();
  }, []);

  const setMode = async (newMode: HajjMode) => {
    try {
      setModeState(newMode);
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
    } catch (e) {
      console.warn('Error saving haji mode:', e);
    }
  };

  const toggleMode = async () => {
    const newMode = mode === 'haji' ? 'umrah' : 'haji';
    await setMode(newMode);
  };

  return (
    <HajiUmrahFilterContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </HajiUmrahFilterContext.Provider>
  );
};

export const useHajiUmrahFilter = () => useContext(HajiUmrahFilterContext);

