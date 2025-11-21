import HomeScreen from "@/app/screens/HomeScreen";
import DuaListScreen from "@/app/screens/DuaListScreen";
import DuaDetailScreen from "@/app/screens/DuaDetailScreen";
import React, {useState} from "react";
import {SelectedDuaType} from "@/app/types";

export default function AppNavigator() {
  const [duas, setDuas] = useState<any[]>([]);
  const [selectedDua, setSelectedDua] = useState<SelectedDuaType>(undefined);
  const [category, setCategory] = useState<string>("");
  const [screen, setScreen] = useState("home");

  switch (screen) {
    case "home":
      return <HomeScreen setScreen={setScreen} setDuas={setDuas} setCategory={setCategory} setSelectedDua={setSelectedDua} />
    case "duaList":
      return <DuaListScreen setScreen={setScreen} duas={duas} category={category} setSelectedDua={setSelectedDua} />
    case "duaDetail":
      return <DuaDetailScreen setScreen={setScreen} selectedDua={selectedDua} setSelectedDua={setSelectedDua} />;
    default:
      return null;
  }
}