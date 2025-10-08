import HomeScreen from "@/app/screens/HomeScreen";
import DuaListScreen from "@/app/screens/DuaListScreen";
import DuaDetailScreen from "@/app/screens/DuaDetailScreen";
import MapScreen from "@/app/screens/MapScreen";
import React, {useState} from "react";

export default function AppNavigator() {
  const [duas, setDuas] = useState<any[]>([]);
  const [selectedDua, setSelectedDua] = useState<any>(null);
  const [screen, setScreen] = useState("home");

  switch (screen) {
    case "home":
      return <HomeScreen setScreen={setScreen} setDuas={setDuas} />
    case "duaList":
      return <DuaListScreen setScreen={setScreen} duas={duas} setSelectedDua={setSelectedDua} />
    case "duaDetail":
      return <DuaDetailScreen setScreen={setScreen} selectedDua={selectedDua} />;
    case "map":
      return <MapScreen setScreen={setScreen} />;
    default:
      return null;
  }
}