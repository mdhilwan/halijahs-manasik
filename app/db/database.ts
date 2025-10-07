import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from "expo-sqlite";
// import * as FileSystem from 'expo-file-system/legacy';

const DB_NAME = 'dua.db';

async function initDatabase(): Promise<SQLiteDatabase> {
  // const dbPath = FileSystem.documentDirectory + 'SQLite/' + DB_NAME;

  // Delete the old DB for development
  // console.log("Purging DB")
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

export async function loadDatabase(): Promise<SQLiteDatabase> {
  return await SQLite.openDatabaseAsync(DB_NAME);
}

export default initDatabase