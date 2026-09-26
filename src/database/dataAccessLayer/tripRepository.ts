// Trip specific operations

import { Trip } from "@/models/Trip";
import { SQLiteDatabase } from "expo-sqlite";

type TripRow = {
    id: string;
    name: string;

    start_date: string;
    end_date: string | null;

    description: string | null;

    budget: number | null;
    budget_currency: string;
};

/**
 * Provides SQLite persistence operations for trips.
 */
export class TripsRepository {
    constructor(private db: SQLiteDatabase) {}


	/**
	 * Returns trips that are active on the specified date.
	 */
    async getTripsForDate(date: string): Promise<Trip[]> {
      const rows = await this.db.getAllAsync<TripRow>(
        `
			SELECT *
			FROM trips
			WHERE start_date <= ?
				AND (end_date IS NULL OR end_date >= ?)
			ORDER BY start_date DESC
		`,
        date,
        date
      );
        
      return rows.map(row => this.mapRowToTrip(row));
    }


	/**
	 * Returns trips that start after the specified date.
	 */
    async getFutureTrips(date: string): Promise<Trip[]> {
      const rows = await this.db.getAllAsync<TripRow>(
        `
			SELECT * FROM trips
			WHERE start_date > ?
			ORDER BY start_date ASC
		`,
        date
      );
    
      return rows.map(row => this.mapRowToTrip(row));
    }
    

	/**
	 * Returns completed trips whose end date is before the specified date.
	 */
    async getPastTrips(date: string): Promise<Trip[]> {
      const rows = await this.db.getAllAsync<TripRow>(
        `
			SELECT * FROM trips
			WHERE end_date IS NOT NULL
				AND end_date < ?
			ORDER BY end_date DESC
		`,
        date
      );
    
      return rows.map(row => this.mapRowToTrip(row));
    }


	/**
	 * Returns all trips ordered by start date.
	 */
    async getTrips(): Promise<Trip[]> {
        const rows = await this.db.getAllAsync<TripRow>(
          	"SELECT * FROM trips ORDER BY start_date"
        );
      
        return rows.map(row => this.mapRowToTrip(row));
      }


	/**
	 * Returns a trip by its ID.
	 */
    async getTripById(id: string): Promise<Trip | null> {
        const row = await this.db.getFirstAsync<TripRow>(
			"SELECT * FROM trips WHERE id = ?",
			id
        );
      
        return row ? this.mapRowToTrip(row) : null;
      }

    
	/**
	 * Maps a SQLite row to the domain Trip model.
	 */
    private mapRowToTrip(row: TripRow): Trip {
        return {
			id: row.id,
			name: row.name,
			startDate: row.start_date,
			endDate: row.end_date,
			description: row.description,
			budget: row.budget,
			budgetCurrency: row.budget_currency,
        };
      }

    
	/**
	 * Persists a new trip.
	 */
    async createTrip(trip: Trip) {
        return this.db.runAsync(
            `
				INSERT INTO trips (
					id,
					name,
					start_date,
					end_date,
					description,
					budget,
					budget_currency
				) 
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`,
            trip.id,
            trip.name,
            trip.startDate,
            trip.endDate,
            trip.description,
            trip.budget,
            trip.budgetCurrency,
        );    
    }

    /**
	 * Updates an existing trip
	 */
    async updateTrip(trip: Trip) {
        return this.db.runAsync(
            `
				UPDATE trips
				SET name = ?,
					start_date = ?,
					end_date = ?,
					description = ?,
					budget = ?,
					budget_currency = ?
				WHERE id = ?
			`,
            trip.name,
            trip.startDate,
            trip.endDate,
            trip.description,
            trip.budget,
            trip.budgetCurrency,
            trip.id
        );
    }

	/**
	 * Deletes a trip by ID.
	 *
	 * Expenses are intentionally not deleted because they represent
	 * long-term financial history.
	 */
    async deleteTrip(id: string) {
        return this.db.runAsync("DELETE FROM trips WHERE id = ?", id);
    }
}
