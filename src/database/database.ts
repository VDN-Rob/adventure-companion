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
        description TEXT,
        budget REAL,
        budget_currency TEXT NOT NULL
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

      CREATE UNIQUE INDEX IF NOT EXISTS idx_days_trip_date ON days (trip_id, date);

      CREATE TABLE IF NOT EXISTS pois (
        id TEXT PRIMARY KEY NOT NULL,
        day_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        notes TEXT,
        visited_at TEXT,
        FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
      );
      
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

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        trip_id TEXT,
        day_id TEXT,
        amount REAL NOT NULL,
        currency TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        FOREIGN KEY (day_id) REFERENCES days(id),
        FOREIGN KEY (trip_id) REFERENCES trips(id)
      );
      
      CREATE TABLE IF NOT EXISTS diary_entries (
        id TEXT PRIMARY KEY NOT NULL,
        day_id TEXT,
        title TEXT NOT NULL,
        text TEXT,
        photo_one TEXT,
        photo_two TEXT,
        photo_three TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
      );  

      CREATE TABLE IF NOT EXISTS exchange_rates (
        id TEXT PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        base_currency TEXT NOT NULL,
        target_currency TEXT NOT NULL,
        rate_date TEXT NOT NULL,
        rate REAL NOT NULL,

        UNIQUE(date, base_currency, target_currency)
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