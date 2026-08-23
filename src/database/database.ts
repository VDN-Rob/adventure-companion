import { deleteDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
// This file is meant to create and/or retrieve the tables when needed
// It is responsible for setting up the databases

export async function setupDatabase(db: SQLiteDatabase) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY ,
        name TEXT ,
        start_date TEXT ,
        end_date TEXT ,
        description TEXT 
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS days (
        id TEXT PRIMARY KEY ,
        trip_id TEXT ,
        date TEXT ,
        title TEXT,
        notes TEXT,
        planned_elevation REAL,
        planned_distance REAL,
        FOREIGN KEY (trip_id) REFERENCES trips(id)
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS stops (
        id TEXT PRIMARY KEY ,
        day_id TEXT ,
        name TEXT ,
        type TEXT ,
        latitude REAL ,
        longitude REAL ,
        notes TEXT,
        FOREIGN KEY (day_id) REFERENCES days(id)
      );
    `);
  }

// For development purposes: database reset
export async function resetDatabase() {
    await deleteDatabaseAsync("cycling.db");
  }