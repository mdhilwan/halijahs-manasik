import React from "react";

export type HomeScreenType = {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setDuas: React.Dispatch<React.SetStateAction<any[]>>;
}

export type DuaDetailType = {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  selectedDua: any;
}

export type DuaListScreenType = {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDua: React.Dispatch<React.SetStateAction<any>>;
  duas: any[];
}

export type MapScreenType = {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
}