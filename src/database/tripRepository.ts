// Trip specific operations

import { Trip } from "@/models/Trip";
import { SQLiteDatabase } from "expo-sqlite";

type TripRow = {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    budget: number | null;
    budget_currency: string;
  };

export class TripsRepository {
    constructor(private db: SQLiteDatabase) {}
    async getTripForDate(date: string) {
      const row = await this.db.getFirstAsync<TripRow>(
        `SELECT *
         FROM trips
         WHERE start_date <= ?
           AND (end_date IS NULL OR end_date >= ?)
         ORDER BY start_date DESC
         LIMIT 1`,
        date,
        date
      );
    
      if (!row) return null;
    
      return this.mapRowToTrip(row);
    }

    async getFutureTrips(date: string) {
      const rows = await this.db.getAllAsync<TripRow>(
        `SELECT * FROM trips
         WHERE start_date > ?
         ORDER BY start_date ASC`,
        date
      );
    
      return rows.map(row => this.mapRowToTrip(row));
    }
    
    async getPastTrips(date: string) {
      const rows = await this.db.getAllAsync<TripRow>(
        `SELECT * FROM trips
         WHERE end_date IS NOT NULL
           AND end_date < ?
         ORDER BY end_date DESC`,
        date
      );
    
      return rows.map(row => this.mapRowToTrip(row));
    }

    // Function to get all the trips
    async getTrips(): Promise<Trip[]> {
        const rows = await this.db.getAllAsync<TripRow>(
          "SELECT * FROM trips ORDER BY start_date"
        );
      
        return rows.map(row => this.mapRowToTrip(row));
      }

    // Function to get one specific trip
    async getTripById(id: string): Promise<Trip | null> {
        const row = await this.db.getFirstAsync<TripRow>(
          "SELECT * FROM trips WHERE id = ?",
          id
        );
      
        if (!row) {
          return null;
        }
      
        return this.mapRowToTrip(row);
      }

    // Small helper function to map database to react
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

    // Funtion to create a new trip
    async createTrip(trip: Trip) {
        return this.db.runAsync(
            `INSERT INTO trips (id, name, start_date, end_date, description, budget, budget_currency) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            trip.id,
            trip.name,
            trip.startDate,
            trip.endDate,
            trip.description ?? "",
            trip.budget,
            trip.budgetCurrency,
        );    
    }

    // Function to update a field from a specific trip
    async updateTrip(trip: Trip) {
        return this.db.runAsync(
            `UPDATE trips
             SET name = ?, start_date = ?, end_date = ?, description = ?, budget = ?, budget_currency = ?
             WHERE id = ?`,
            trip.name,
            trip.startDate,
            trip.endDate,
            trip.description ?? "",
            trip.budget,
            trip.budgetCurrency,
            trip.id
        );
    }

    // Function to delete a trip
    async deleteTrip(id: string) {
        return this.db.runAsync(
            "DELETE FROM trips WHERE id = ?",
            id
        );
    }
}
