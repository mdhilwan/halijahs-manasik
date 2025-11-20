import React, {createContext, useContext, useEffect, useState} from 'react';
import {LanguageType} from "@/app/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LanguageEnums} from "@/app/contexts/enums";

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: LanguageEnums.EN,
  setLanguage: () => {
  },
});

export const LanguageProvider = ({children}: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageType>(LanguageEnums.EN);
  const STORAGE_KEY = 'app_language';

  // Load persisted language on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedLang === LanguageEnums.EN || savedLang === LanguageEnums.MY) {
          setLanguageState(savedLang);
        }
      } catch (e) {
        console.warn('Error loading language:', e);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: LanguageType) => {
    try {
      setLanguageState(lang);
      await AsyncStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Error saving language:', e);
    }
  };

  return (
    <LanguageContext.Provider value={{language, setLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);