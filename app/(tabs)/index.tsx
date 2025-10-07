import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import initDatabase from "@/app/db/database";
import seedSampleData from "@/app/db/seedData";
import HomeScreen from "@/app/screens/HomeScreen";
import DuaListScreen from "@/app/screens/DuaListScreen";
import DuaDetailScreen from "@/app/screens/DuaDetailScreen";
import MapScreen from "@/app/screens/MapScreen";

export default function App() {
  const [db, setDb] = useState<SQLite.WebSQLDatabase | null>(null);
  const [screen, setScreen] = useState("home");
  const [duas, setDuas] = useState<any[]>([]);
  const [selectedDua, setSelectedDua] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- Initialize DB on first launch ---
  useEffect(() => {
    (async () => {
      const db = await initDatabase()
      await seedSampleData(db)
      setDb(db)
      setLoading(false)
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading content...</Text>
      </View>
    );
  }

  switch (screen) {
    case "home":
      return <HomeScreen setScreen={setScreen} db={db} setDuas={setDuas} />
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

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  button: { backgroundColor: "#00695c", padding: 20, borderRadius: 16, marginVertical: 10, width: "90%" },
  buttonText: { color: "#fff", fontSize: 20, textAlign: "center" },
  listItem: { backgroundColor: "#e0f2f1", padding: 20, marginVertical: 8, borderRadius: 10 },
  listText: { fontSize: 18 },
  arabic: { fontSize: 28, textAlign: "center", marginVertical: 20, color: "#333" },
  translation: { fontSize: 18, textAlign: "center", color: "#555" },
  audioButton: { backgroundColor: "#00796b", padding: 16, borderRadius: 10, marginTop: 20 },
  back: { fontSize: 18, color: "#00796b", alignSelf: "flex-start" },
});