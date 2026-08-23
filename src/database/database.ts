import { deleteDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
// This file is meant to create and/or retrieve the tables when needed
// It is responsible for setting up the databases

export async function setupDatabase(db: SQLiteDatabase) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        description TEXT 
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS days (
        id TEXT PRIMARY KEY NOT NULL,
        trip_id TEXT NOT NULL,
        date TEXT NOT NULL,
        title TEXT,
        notes TEXT,
        planned_elevation REAL,
        planned_distance REAL,
        FOREIGN KEY (trip_id) REFERENCES trips(id)
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS stops (
        id TEXT PRIMARY KEY NOT NULL,
        day_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        notes TEXT,
        FOREIGN KEY (day_id) REFERENCES days(id)
      );
    `);
  }

// For development purposes: database reset
export async function resetDatabase() {
    await deleteDatabaseAsync("cycling.db");
  }