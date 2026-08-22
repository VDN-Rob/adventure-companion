import { Day } from "@/models/Day";
import { SQLiteDatabase } from "expo-sqlite";

type DayRow = {
    id: string;
    trip_id: string;
    date: string;
    title: string;
    notes: string;
    planned_elevation: number;
    planned_distance: number;
  };

export class DayRepository {
    constructor(private db: SQLiteDatabase) {}

    // Function to retrieve all days for a specific trip
    async getAllForTrip(tripId: string) {
        const rows = await this.db.getAllAsync<DayRow>(
            "SELECT * FROM days WHERE trip_id = ? ORDER BY date ASC",
            tripId
        );
        
        return rows.map(row => this.mapRowToDay(row));
    }

    // Function to get one specific day
    async getById(id: string) {
        const row = await this.db.getFirstAsync<DayRow>(
            "SELECT * FROM days WHERE id = ?",
            id
        );

        if (!row) return null;

        return this.mapRowToDay(row);
    }

    // Small helper function to map database to react
    private mapRowToDay(row: DayRow): Day {
        return {
            id: row.id,
            tripId: row.trip_id,
            date: row.date,
            title: row.title,
            notes: row.notes,
            plannedElevation: row.planned_elevation,
            plannedDistance: row.planned_distance,
        };
    }

    async create(day: Day) {
        return this.db.runAsync(
            `INSERT INTO days (id, trip_id, date, title, notes, planned_elevation, planned_distance)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            day.id,
            day.tripId,
            day.date,
            day.title ?? "",
            day.notes ?? "",
            day.plannedElevation ?? 0,
            day.plannedDistance ?? 0
        );
    }

    async update(day: Day) {
        return this.db.runAsync(
            `UPDATE days
            SET date = ?, title = ?, notes = ?, planned_elevation = ?, planned_distance = ?
            WHERE id = ?`,
            day.date,
            day.title ?? "",
            day.notes ?? "",
            day.plannedElevation ?? 0,
            day.plannedDistance ?? 0,
            day.id
        );
    }

    async delete(id: string) {
        return this.db.runAsync(
            "DELETE FROM days WHERE id = ?",
            id
        );
    }
    
}