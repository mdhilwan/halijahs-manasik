import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from "expo-sqlite";
// import * as FileSystem from 'expo-file-system/legacy';

const DB_NAME = 'dua.db';

async function initDinitDatabaseatabase(): Promise<SQLiteDatabase> {
  // const dbPath = FileSystem.documentDirectory + 'SQLite/' + DB_NAME;

  // Delete the old DB for development
  // await FileSystem.deleteAsync(dbPath, { idempotent: true });

  const db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS duas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      arabic TEXT,
      translation TEXT,
      category TEXT,
      audio TEXT
    );
  `);

  return db;
}

export default initDinitDatabaseatabase