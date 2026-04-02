import { useMemo } from 'react';

export const HAJJ_ONLY_SECTIONS = ['arafah', 'mina', 'muzdalifah', 'stoning'] as const;

export type HajjMode = 'haji' | 'umrah';

export type ButtonType = {
  key: string;
  bgImg?: any;
};

export const HOME_SCREEN_BUTTONS: ButtonType[] = [
  { key: 'ihram', bgImg: require('@/assets/images/button-bg/ihram.png') },
  { key: 'talbiyah', bgImg: require('@/assets/images/button-bg/talbiyah.png') },
  { key: 'travel', bgImg: require('@/assets/images/button-bg/travel.png') },
  { key: 'masjidil haram', bgImg: require('@/assets/images/button-bg/masjidil-haram.png') },
  { key: 'tawaf', bgImg: require('@/assets/images/button-bg/tawaf.png') },
  { key: 'zam-zam', bgImg: require('@/assets/images/button-bg/zamzam.png') },
  { key: "sa'i", bgImg: require('@/assets/images/button-bg/sai.png') },
  { key: 'tahalul', bgImg: require('@/assets/images/button-bg/tahallul.png') },
  { key: 'tawaf wadak', bgImg: require('@/assets/images/button-bg/tawaf-wada.png') },
  { key: 'madinah', bgImg: require('@/assets/images/button-bg/madinah.png') },
  { key: 'arafah', bgImg: require('@/assets/images/button-bg/arafah.png') },
  { key: 'mina', bgImg: require('@/assets/images/button-bg/mina.png') },
  { key: 'muzdalifah', bgImg: require('@/assets/images/button-bg/muzdalifah.png') },
  { key: 'stoning', bgImg: require('@/assets/images/button-bg/jamrah.png') },
];

/**
 * Custom hook to filter buttons based on hajj/umrah mode
 */
export const useFilteredButtons = (mode: HajjMode) => {
  return useMemo(() => {
    if (mode === 'haji') {
      return HOME_SCREEN_BUTTONS;
    }

    return HOME_SCREEN_BUTTONS.filter(btn => !HAJJ_ONLY_SECTIONS.includes(btn.key as any));
  }, [mode]);
};

