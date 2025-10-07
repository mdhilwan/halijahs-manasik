import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as SQLite from "expo-sqlite";

type HomeScreenType = {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setDuas: React.Dispatch<React.SetStateAction<any[]>>;
  db:SQLite.WebSQLDatabase | null;
}

export default function HomeScreen({ setScreen, db, setDuas }: HomeScreenType): React.JSX.Element {
  const loadDuas = async (category: string) => {
    const result = await db.getAllAsync('SELECT * FROM duas WHERE category = ?', [category]);
    setDuas(result);
    setScreen('duaList');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hajj & Umrah Companion</Text>

      <TouchableOpacity style={styles.button} onPress={() => loadDuas('hajj')}>
        <Text style={styles.buttonText}>🕋 Du'a for Hajj</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => loadDuas('umrah')}>
        <Text style={styles.buttonText}>🕋 Du'a for Umrah</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setScreen('map')}>
        <Text style={styles.buttonText}>🗺️ Map of Makkah & Madinah</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  button: { backgroundColor: '#00695c', padding: 20, borderRadius: 16, marginVertical: 10, width: '90%' },
  buttonText: { color: '#fff', fontSize: 20, textAlign: 'center' },
});