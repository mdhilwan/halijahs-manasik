import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapScreenType } from "@/app/types";

export default function MapScreen({ setScreen }: MapScreenType) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>Map of Makkah & Madinah</Text>
      <Text style={styles.translation}>[Static image here — to be replaced with interactive map later]</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  translation: { fontSize: 18, textAlign: 'center', color: '#555' },
  back: { fontSize: 18, color: '#00796b', marginBottom: 10 },
});