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
  const [arabicFontSize, setArabicFontSizeState] = useState<number>(24);
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
            setTranslationFontSizeState(translationFontSize);
          }
          if (arabicFontSize) {
            setArabicFontSizeState(arabicFontSize);
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
      setTranslationFontSizeState(fontSize);
      const savedFontSizes = {
        translationFontSize: fontSize,
        arabicFontSize: arabicFontSize
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedFontSizes));
    } catch (e) {
      console.warn('Error saving translation font sizes:', e);
    }
  }

  const setArabicFontSize = async (fontSize: number) => {
    try {
      setArabicFontSizeState(fontSize);
      const savedFontSizes = {
        translationFontSize: translationFontSize,
        arabicFontSize: fontSize
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