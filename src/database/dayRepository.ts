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

export class DaysRepository {
    constructor(private db: SQLiteDatabase) {}

    async getDayByDate(date: string) {
        const row = await this.db.getFirstAsync<DayRow>(
            `SELECT * FROM days WHERE date = ?`,
            date
        )
        
        if (!row) return null;

        return this.mapRowToDay(row);
    }

    // Function to retrieve all days for a specific trip
    async getAllDayForTrip(tripId: string) {
        const rows = await this.db.getAllAsync<DayRow>(
            "SELECT * FROM days WHERE trip_id = ? ORDER BY date ASC",
            tripId
        );
        
        return rows.map(row => this.mapRowToDay(row));
    }

    // Function to get one specific day
    async getDayById(id: string) {
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

    async createDay(day: Day) {
        return this.db.runAsync(
            `INSERT INTO days (id, trip_id, date, title, notes, planned_elevation, planned_distance)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            day.id,
            day.tripId,
            day.date,
            day.title,
            day.notes,
            day.plannedElevation,
            day.plannedDistance
        );
    }

    async updateDay(day: Day) {
        return this.db.runAsync(
            `UPDATE days
            SET date = ?, title = ?, notes = ?, planned_elevation = ?, planned_distance = ?
            WHERE id = ?`,
            day.date,
            day.title,
            day.notes,
            day.plannedElevation,
            day.plannedDistance,
            day.id
        );
    }

    async deleteDay(id: string) {
        return this.db.runAsync(
            "DELETE FROM days WHERE id = ?",
            id
        );
    }
    
}