import { useMemo } from 'react';

export const HAJJ_ONLY_SECTIONS = ['arafah', 'mina', 'muzdalifah', 'stoning'] as const;

export type HajjMode = 'haji' | 'umrah';

export type ButtonType = {
  key: string;
  bgImg?: any;
};

export const HOME_SCREEN_BUTTONS: ButtonType[] = [
  // Note: `current` is a generated folder (see `scripts/select-brand.mjs`).
  { key: 'ihram', bgImg: require('@/assets/images/button-bg/current/ihram.png') },
  { key: 'talbiyah', bgImg: require('@/assets/images/button-bg/current/talbiyah.png') },
  { key: 'travel', bgImg: require('@/assets/images/button-bg/current/travel.png') },
  { key: 'masjidil haram', bgImg: require('@/assets/images/button-bg/current/masjidil-haram.png') },
  { key: 'tawaf', bgImg: require('@/assets/images/button-bg/current/tawaf.png') },
  { key: 'zam-zam', bgImg: require('@/assets/images/button-bg/current/zamzam.png') },
  { key: "sa'i", bgImg: require('@/assets/images/button-bg/current/sai.png') },
  { key: 'tahalul', bgImg: require('@/assets/images/button-bg/current/tahallul.png') },
  { key: 'tawaf wadak', bgImg: require('@/assets/images/button-bg/current/tawaf-wada.png') },
  { key: 'madinah', bgImg: require('@/assets/images/button-bg/current/madinah.png') },
  { key: 'arafah', bgImg: require('@/assets/images/button-bg/current/arafah.png') },
  { key: 'mina', bgImg: require('@/assets/images/button-bg/current/mina.png') },
  { key: 'muzdalifah', bgImg: require('@/assets/images/button-bg/current/muzdalifah.png') },
  { key: 'stoning', bgImg: require('@/assets/images/button-bg/current/jamrah.png') },
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

