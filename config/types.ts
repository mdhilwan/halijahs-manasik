import React from "react";
import {LanguageEnums} from "../constants/language-enums";

export type DuaEngMalayArabicType = {
  id: number;
  arabic: string;
  translationMy: string | string[];
  translationEn: string | string[];
}

export type DuaType = {
  id: number;
  titleEn: string;
  titleMy: string;
  doa: DuaEngMalayArabicType[];
  categoryKey: string[];
  audio?: string;
}

export type SelectedDuaType = undefined | {
  curr: number | undefined;
  duas: DuaType[];
}

export type PlayStopButtonType = {
  dua: DuaType;
  selectedDua: SelectedDuaType,
  setSelectedDua: React.Dispatch<React.SetStateAction<SelectedDuaType>>
  isFavourited?: boolean;
  toggleFavourite?: () => void;
}

export type LanguageType = LanguageEnums.EN | LanguageEnums.MY;

export type HomeStackParamList = {
  index: undefined;
  duaList: {
    category: string;
    duas: DuaType[];
  };
  duaDetail: {
    selectedDua: SelectedDuaType;
  };
};

export type SearchStackParamList = {
  index: undefined;
  duaDetail: {
    selectedDua: SelectedDuaType;
  };
};