import React from "react";

export type HomeScreenType = {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setDuas: React.Dispatch<React.SetStateAction<any[]>>;
}

export type DuaType = {
  id: number;
  title: string;
  arabic: string;
  translation: string;
  category: string;
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