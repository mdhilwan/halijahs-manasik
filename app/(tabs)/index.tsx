import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import initDatabase, { loadDatabase } from "@/app/db/database";
import seedSampleData from "@/app/db/seedData";
import AppNavigator from "@/app/(tabs)/AppNavigator";

export default function App() {
  const [db, setDb] = useState<SQLite.WebSQLDatabase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const dbRes = await initDatabase()
      await seedSampleData(dbRes)
      const db = await loadDatabase()
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

  return <AppNavigator db={db} />
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: 20 },
});