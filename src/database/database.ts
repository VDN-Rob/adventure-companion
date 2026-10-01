import { deleteDatabaseAsync, SQLiteDatabase } from "expo-sqlite";


/**
 * Initializes the SQLite database schema.
 *
 * Database initialization is idempotent: existing tables and indexes are
 * preserved, while missing tables and indexes are created as needed.
 */
export async function setupDatabase(db: SQLiteDatabase): Promise<void> {
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
		
		CREATE TABLE IF NOT EXISTS offline_maps (
			id TEXT PRIMARY KEY NOT NULL,
			offline_region_id TEXT UNIQUE NOT NULL,
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
			amount REAL NOT NULL,
			currency TEXT NOT NULL,
			category TEXT NOT NULL,
			description TEXT,
			date TEXT NOT NULL,
			FOREIGN KEY (trip_id) REFERENCES trips(id)
		);
		
		CREATE TABLE IF NOT EXISTS diary_entries (
			id TEXT PRIMARY KEY NOT NULL,
			day_id TEXT NOT NULL,
			title TEXT NOT NULL,
			text TEXT,
			photo_one TEXT,
			photo_two TEXT,
			photo_three TEXT,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
		);  
		
		CREATE UNIQUE INDEX IF NOT EXISTS idx_diary_entries_day ON diary_entries (day_id);

		CREATE TABLE IF NOT EXISTS exchange_rates (
			id TEXT PRIMARY KEY NOT NULL,
			date TEXT NOT NULL,
			base_currency TEXT NOT NULL,
			target_currency TEXT NOT NULL,
			rate_date TEXT NOT NULL,
			rate REAL NOT NULL,

			UNIQUE(date, base_currency, target_currency)
		);

		CREATE TABLE IF NOT EXISTS routes (
			id TEXT PRIMARY KEY NOT NULL,
			day_id TEXT NOT NULL,
			name TEXT,
			distance_meters REAL,
			elevation_gain_meters REAL,
			elevation_loss_meters REAL,
			imported_at TEXT NOT NULL,
			file_path TEXT NOT NULL,
			FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS trackpoints (
			id TEXT PRIMARY KEY NOT NULL,
			route_id TEXT NOT NULL,
			sequence INTEGER NOT NULL,
			latitude REAL NOT NULL,
			longitude REAL NOT NULL,
			elevation REAL,
			timestamp TEXT,
			FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
		);

		CREATE INDEX IF NOT EXISTS idx_routes_day_id ON routes(day_id);

		CREATE INDEX IF NOT EXISTS idx_trackpoints_route_id ON trackpoints(route_id);
    `);
}



/**
 * Deletes the local development database.
 *
 * This function is intended for development and testing only.
 */
export async function resetDatabase() {
    await deleteDatabaseAsync("cycling.db");
  }