const tintColorLight = '#242423';
const tintColorDark = '#fff';

export const Colors = {
  base: {
    tint: '#ffd65c',
  },
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    // Brand token(s)
    headerBackgroundColor: '#BF9960',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    // Brand token(s)
    headerBackgroundColor: '#BF9960',
  },
  StatusBarStyle: 'dark'
} as const;

