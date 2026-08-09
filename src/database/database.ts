import { SQLiteDatabase } from "expo-sqlite";
// This file is meant to create and/or retrieve the tables when needed
// It is responsible for setting up the databases

export async function setupDatabase(db: SQLiteDatabase) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL
      );
    `);
  }