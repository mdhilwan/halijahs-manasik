import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import {useFonts} from "expo-font";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultBold' | 'subtitle' | 'link' | 'arabic' | 'arabic-bold' | 'serif';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const [fontLoaded] = useFonts({
    'ScheherazadeNew-Regular': require('@/assets/font/ScheherazadeNew-Regular.ttf'),
    'Mulish-Bold': require('@/assets/font/Mulish-Bold.ttf'),
    'Mulish-Regular': require('@/assets/font/Mulish-Regular.ttf'),
    'Lora-Regular': require('@/assets/font/Lora-Regular.ttf'),
  });

  return (
    fontLoaded && <Text
      style={[
        {color},
        {flexShrink: 1},
        {fontFamily: "Mulish-Regular"},
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultBold' ? styles.defaultBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'serif' ? styles.serif : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'arabic' ? styles.arabic : undefined,
        style,
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultBold: {
    fontFamily: 'Mulish-Bold',
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Mulish-Bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  arabic: {
    fontFamily: 'ScheherazadeNew-Regular',
    writingDirection: "rtl",
    textAlign: 'center',
  },
  serif: {
    fontFamily: 'Lora-Regular',
  },
});
