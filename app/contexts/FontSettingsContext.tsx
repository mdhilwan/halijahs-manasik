import {createContext, useContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FontSettingsType {
  showSettings: boolean;
  setShowSettings: (showSettings: boolean) => void;
  translationFontSize: number;
  setTranslationFontSize: (size: number) => void;
  arabicFontSize: number;
  setArabicFontSize: (size: number) => void;
  duaHidden: boolean;
  setHideDua: (hide: boolean) => void;
  translationHidden: boolean;
  setHideTranslation: (hide: boolean) => void;
}

export const MAX_ARABIC_FONT_SIZE = 60;
export const MAX_TRANSLATION_FONT_SIZE = 36;
export const MIN_ARABIC_FONT_SIZE = 24;
export const MIN_TRANSLATION_FONT_SIZE = 16;

const FontSettingsContext = createContext<FontSettingsType>({
  showSettings: false,
  setShowSettings: (show: boolean) => {},
  arabicFontSize: 36,
  setArabicFontSize: (size: number) => {},
  translationFontSize: 24,
  setTranslationFontSize: (size: number) => {},
  duaHidden: false,
  setHideDua: (hide: boolean) => {},
  translationHidden: false,
  setHideTranslation: (hide: boolean) => {},
})

export const FontSettingsProvider = ({children}: {children: React.ReactNode}) => {
  const [translationFontSize, setTranslationFontSizeState] = useState<number>(24);
  const [arabicFontSize, setArabicFontSizeState] = useState<number>(36);
  const [showSettings, setShowSettingsState] = useState<boolean>(false);
  const [duaHidden, setHideDuaState] = useState<boolean>(false);
  const [translationHidden, setHideTranslationState] = useState<boolean>(false);

  const STORAGE_KEY = 'app_sizes';

  useEffect(() => {
    const loadFontSizes = async () => {
      try {
        const savedFontSizes = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedFontSizes) {
          const { translationFontSize, arabicFontSize } = JSON.parse(savedFontSizes)
          if (translationFontSize) {
            const clampedTranslation = Math.max(MIN_TRANSLATION_FONT_SIZE, Math.min(translationFontSize, MAX_TRANSLATION_FONT_SIZE));
            setTranslationFontSizeState(clampedTranslation);
          }
          if (arabicFontSize) {
            const clampedArabic = Math.max(MIN_ARABIC_FONT_SIZE, Math.min(arabicFontSize, MAX_ARABIC_FONT_SIZE));
            setArabicFontSizeState(clampedArabic);
          }
        }
      } catch (e) {
        console.warn('Error loading saved font sizes:', e);
      }
    };
    loadFontSizes()
  }, []);

  const setTranslationFontSize = async (fontSize: number) => {
    try {
      const clampedSize = Math.max(MIN_TRANSLATION_FONT_SIZE, Math.min(fontSize, MAX_TRANSLATION_FONT_SIZE));
      setTranslationFontSizeState(clampedSize);
      const savedFontSizes = {
        translationFontSize: clampedSize,
        arabicFontSize: arabicFontSize
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedFontSizes));
    } catch (e) {
      console.warn('Error saving translation font sizes:', e);
    }
  }

  const setArabicFontSize = async (fontSize: number) => {
    try {
      const clampedSize = Math.max(MIN_ARABIC_FONT_SIZE, Math.min(fontSize, MAX_ARABIC_FONT_SIZE));
      setArabicFontSizeState(clampedSize);
      const savedFontSizes = {
        translationFontSize: translationFontSize,
        arabicFontSize: clampedSize
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedFontSizes));
    } catch (e) {
      console.warn('Error saving arabic font sizes:', e);
    }
  }

  const setShowSettings = (showSettings: boolean) => setShowSettingsState(showSettings);
  const setHideDua = (hideDua: boolean) => setHideDuaState(hideDua);
  const setHideTranslation = (hideTranslation: boolean) => setHideTranslationState(hideTranslation);

  return (
    <FontSettingsContext.Provider value={{
      arabicFontSize, setArabicFontSize,
      translationFontSize, setTranslationFontSize,
      showSettings, setShowSettings,
      duaHidden, setHideDua,
      translationHidden, setHideTranslation
    }}>
      {children}
    </FontSettingsContext.Provider>
  )
}

export const useFontSize = () => useContext(FontSettingsContext);