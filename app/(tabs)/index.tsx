import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Map audio filenames to actual imports
const audioMap: Record<string, any> = {
  "talbiyah.mp3": require("../../assets/audio/talbiyah.mp3"),
};

// Database path for purge
const DB_FILE_PATH = FileSystem.documentDirectory + "SQLite/dua.db";

export default function App() {
  const [db, setDb] = useState<SQLite.WebSQLDatabase | null>(null);
  const [screen, setScreen] = useState("home");
  const [duas, setDuas] = useState<any[]>([]);
  const [selectedDua, setSelectedDua] = useState<any>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // --- Initialize DB on first launch ---
  useEffect(() => {
    (async () => {
      // console.log("Purging old DB")
      // Purge old DB
      // await FileSystem.deleteAsync(DB_FILE_PATH, { idempotent: true });

      // Open new database
      const database = await SQLite.openDatabaseAsync("dua.db");
      setDb(database);

      // Create table
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS duas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          arabic TEXT,
          translation TEXT,
          category TEXT,
          audio TEXT
        );
      `);

      // Insert sample data if table is empty
      const rows = await database.getAllAsync("SELECT * FROM duas;");
      if (rows.length === 0) {
        await database.runAsync(
          "INSERT INTO duas (title, arabic, translation, category, audio) VALUES (?, ?, ?, ?, ?);",
          [
            "Talbiyah",
            "لَبَّيْكَ اللَّهُمَّ لَبَّيْك",
            "Here I am, O Allah, here I am",
            "hajj",
            "talbiyah.mp3",
          ]
        );
      }
    })();
  }, []);

  // --- Load Duas by category ---
  const loadDuas = async (category: string) => {
    if (!db) return;
    const rows = await db.getAllAsync("SELECT * FROM duas WHERE category = ?;", [category]);
    setDuas(rows);
    setScreen("duaList");
  };

  // --- Play Audio ---
  const playAudio = async (audioFileName: string) => {
    if (sound) await sound.unloadAsync();
    const { sound: newSound } = await Audio.Sound.createAsync(audioMap[audioFileName]);
    setSound(newSound);
    await newSound.playAsync();
  };

  // --- SCREENS ---
  if (screen === "home") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Hajj & Umrah Companion</Text>
        <TouchableOpacity style={styles.button} onPress={() => loadDuas("hajj")}>
          <Text style={styles.buttonText}>🕋 Du'a for Hajj</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => loadDuas("umrah")}>
          <Text style={styles.buttonText}>🕋 Du'a for Umrah</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setScreen("map")}>
          <Text style={styles.buttonText}>🗺️ Map of Makkah & Madinah</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === "duaList") {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.back}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>Du’a List</Text>
        <ScrollView>
          {duas.map(dua => (
            <TouchableOpacity
              key={dua.id}
              style={styles.listItem}
              onPress={() => {
                setSelectedDua(dua);
                setScreen("duaDetail");
              }}
            >
              <Text style={styles.listText}>{dua.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "duaDetail" && selectedDua) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen("duaList")}><Text style={styles.back}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>{selectedDua.title}</Text>
        <Text style={styles.arabic}>{selectedDua.arabic}</Text>
        <Text style={styles.translation}>{selectedDua.translation}</Text>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={() => playAudio(selectedDua.audio)}
        >
          <Text style={styles.buttonText}>▶️ Play Audio</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === "map") {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.back}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>Map of Makkah & Madinah</Text>
        <Text style={styles.translation}>[Static image here — to be replaced with interactive map later]</Text>
      </SafeAreaView>
    );
  }

  return null;
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