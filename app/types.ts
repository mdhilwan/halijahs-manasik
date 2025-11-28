import React from "react";
import {LanguageEnums} from "@/constants/language-enums";
import {EventType} from "react-native-sse";
import {EventTypes} from "react-native-gesture-handler/lib/typescript/web/interfaces";

export type HomeScreenType = {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setDuas: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedDua: React.Dispatch<React.SetStateAction<SelectedDuaType>>;
}

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
  audio: string;
}

export type SelectedDuaType = undefined | {
  curr: number | undefined;
  duas: DuaType[];
}

export type DuaDetailType = {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDua: React.Dispatch<React.SetStateAction<SelectedDuaType>>;
  selectedDua: SelectedDuaType;
}

export type DuaListScreenType = {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDua: React.Dispatch<React.SetStateAction<SelectedDuaType>>;
  duas: DuaType[];
  category: string;
}

export type MapScreenType = {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
}

export type PlayStopButtonType = {
  dua: DuaType;
  selectedDua: SelectedDuaType,
  setSelectedDua: React.Dispatch<React.SetStateAction<SelectedDuaType>>
}

export type LanguageType = LanguageEnums.EN | LanguageEnums.MY;