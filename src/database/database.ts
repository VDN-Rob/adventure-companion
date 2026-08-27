import { deleteDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
// This file is meant to create and/or retrieve the tables when needed
// It is responsible for setting up the databases

export async function setupDatabase(db: SQLiteDatabase) {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        description TEXT 
      );

      CREATE TABLE IF NOT EXISTS days (
        id TEXT PRIMARY KEY NOT NULL,
        trip_id TEXT NOT NULL,
        date TEXT NOT NULL,
        title TEXT,
        notes TEXT,
        planned_elevation REAL,
        planned_distance REAL,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS pois (
        id TEXT PRIMARY KEY NOT NULL,
        day_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        notes TEXT,
        FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
      );

      DROP TABLE IF EXISTS maps;
      
      CREATE TABLE IF NOT EXISTS maps (
        id TEXT PRIMARY KEY NOT NULL,
        offline_region_id TEXT NOT NULL,
        name TEXT,
        min_zoom INTEGER NOT NULL,
        max_zoom INTEGER NOT NULL,
        west REAL NOT NULL,
        south REAL NOT NULL,
        east REAL NOT NULL,
        north REAL NOT NULL,
        creation_date TEXT NOT NULL
      );

      
    `);
  }

//   routes
// ────────────────────────
// id
// day_id
// name
// distance_meters
// elevation_gain_meters
// elevation_loss_meters
// track_point_count
// file_path
// imported_at

// For development purposes: database reset
export async function resetDatabase() {
    await deleteDatabaseAsync("cycling.db");
  }