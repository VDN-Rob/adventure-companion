// Trip specific operations

import { Trip } from "@/models/Trip";
import { SQLiteDatabase } from "expo-sqlite";


export class TripsRepository {
    constructor(private db: SQLiteDatabase) {}
    
    // Function to get all the trips
    async getTrips() : Promise<Trip[]> {
        return this.db.getAllAsync<Trip>(
            "SELECT * FROM trips ORDER BY start_date"
        );
    }

    // Function to get one specific trip
    async getTripById(id: string) : Promise<Trip | null> {
        return this.db.getFirstAsync<Trip>(
            "SELECT * FROM trips WHERE id = ?",
            [id]
        );
    }

    // Funtion to create a new trip
    async createTrip(trip: Trip) {
        return this.db.runAsync(
            `INSERT INTO trips (id, name, start_date, end_date) 
            VALUES (?, ?, ?, ?)`,
            trip.id,
            trip.name,
            trip.startDate,
            trip.endDate
        );    
    }

    // Function to update a field from a specific trip
    async updateTrip(trip: Trip) {
        return this.db.runAsync(
            `UPDATE trips
             SET name = ?, start_date = ?, end_date = ?
             WHERE id = ?`,
            trip.name,
            trip.startDate,
            trip.endDate,
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
