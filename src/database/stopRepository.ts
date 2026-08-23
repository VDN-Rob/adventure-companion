import { Stop, StopType } from "@/models/Stop";
import { SQLiteDatabase } from "expo-sqlite";

type StopRow = {
    id: string;
    day_id: string;
    name: string;
    type: StopType;
    latitude: number;
    longitude: number;
    notes: string;
  };

export class DaysRepository {
    constructor(private db: SQLiteDatabase) {}

    // Function to retrieve all stops for a specific day
    async getAllStopsForDay(dayId: string) {
        const rows = await this.db.getAllAsync<StopRow>(
            "SELECT * FROM stops WHERE day_id = ? ORDER BY name ASC",
            dayId
        );
        
        return rows.map(row => this.mapRowToStop(row));
    }

    // Function to get one specific stop
    async getStopById(id: string) {
        const row = await this.db.getFirstAsync<StopRow>(
            "SELECT * FROM stops WHERE id = ?",
            id
        );

        if (!row) return null;

        return this.mapRowToStop(row);
    }

    // Small helper function to map database to react
    private mapRowToStop(row: StopRow): Stop {
        return {
            id: row.id,
            dayId: row.day_id,
            name: row.name,
            type: row.type,
            latitude: row.latitude,
            longitude: row.longitude,
            notes: row.notes,
        };
    }

    async createStop(stop: Stop) {
        return this.db.runAsync(
            `INSERT INTO stops (id, day_id, name, type, latitude, longitude, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            stop.id,
            stop.dayId,
            stop.name,
            stop.type,
            stop.latitude ?? 0,
            stop.longitude ?? 0,
            stop.notes ?? "",
        );
    }

    async updateStop(stop: Stop) {
        return this.db.runAsync(
            `UPDATE stops
            SET name = ?, type = ?, latitude = ?, longitude = ?,  notes = ?
            WHERE id = ?`,
            stop.name,
            stop.type,
            stop.latitude ?? 0,
            stop.longitude ?? 0,
            stop.notes ?? "",
            stop.id
        );
    }

    async deleteStop(id: string) {
        return this.db.runAsync(
            "DELETE FROM stops WHERE id = ?",
            id
        );
    }
    
}