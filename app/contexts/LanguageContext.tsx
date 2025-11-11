import React, {createContext, useContext, useEffect, useState} from 'react';
import {Language} from "@/app/types";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

export const LanguageProvider = ({children}: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const STORAGE_KEY = 'app_language';

  // Load persisted language on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedLang === 'en' || savedLang === 'my') {
          setLanguageState(savedLang);
        }
      } catch (e) {
        console.warn('Error loading language:', e);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
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