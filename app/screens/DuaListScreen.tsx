import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { DuaListScreenType } from "@/app/types";

export default function DuaListScreen({ setScreen, duas, setSelectedDua, category }: DuaListScreenType) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>{category} Du’a List</Text>
      <ScrollView>
        {duas.map((dua, j) => (
          <TouchableOpacity
            key={j}
            style={styles.listItem}
            onPress={() => {
              setSelectedDua({
                curr: j,
                duas: duas,
              });
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  listItem: { backgroundColor: '#e0f2f1', padding: 20, marginVertical: 8, borderRadius: 10 },
  listText: { fontSize: 18 },
  back: { fontSize: 18, color: '#00796b', marginBottom: 10 },
});