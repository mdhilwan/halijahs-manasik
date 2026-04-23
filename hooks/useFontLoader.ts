import { useFonts } from 'expo-font';

const FONT_FILES = {
  'Mulish-Bold': require('@/assets/font/Mulish-Bold.ttf'),
} as const;

/**
 * Custom hook to load fonts consistently across the app
 * @returns {boolean} Whether fonts are loaded
 */
export const useFontLoader = () => {
  const [fontLoaded] = useFonts(FONT_FILES);
  return fontLoaded;
};

