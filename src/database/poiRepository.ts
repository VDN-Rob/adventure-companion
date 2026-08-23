import { POI, POIType } from "@/models/POI";
import { SQLiteDatabase } from "expo-sqlite";

type PoiRow = {
    id: string;
    day_id: string;
    name: string;
    type: POIType;
    latitude: number;
    longitude: number;
    notes: string;
  };

export class PoisRepository {
    constructor(private db: SQLiteDatabase) {}

    // Function to retrieve all pois for a specific day
    async getAllPOIsForDay(dayId: string) {
        const rows = await this.db.getAllAsync<PoiRow>(
            "SELECT * FROM pois WHERE day_id = ? ORDER BY name ASC",
            dayId
        );
        
        return rows.map(row => this.mapRowToPOI(row));
    }

    // Function to get one specific poi
    async getPOIById(id: string) {
        const row = await this.db.getFirstAsync<PoiRow>(
            "SELECT * FROM pois WHERE id = ?",
            id
        );

        if (!row) return null;

        return this.mapRowToPOI(row);
    }

    // Small helper function to map database to react
    private mapRowToPOI(row: PoiRow): POI {
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

    async createPOI(poi: POI) {
        return this.db.runAsync(
            `INSERT INTO pois (id, day_id, name, type, latitude, longitude, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            poi.id,
            poi.dayId,
            poi.name,
            poi.type,
            poi.latitude ?? 0,
            poi.longitude ?? 0,
            poi.notes ?? "",
        );
    }

    async updatePOI(poi: POI) {
        return this.db.runAsync(
            `UPDATE pois
            SET name = ?, type = ?, latitude = ?, longitude = ?,  notes = ?
            WHERE id = ?`,
            poi.name,
            poi.type,
            poi.latitude ?? 0,
            poi.longitude ?? 0,
            poi.notes ?? "",
            poi.id
        );
    }

    async deletePOI(id: string) {
        return this.db.runAsync(
            "DELETE FROM pois WHERE id = ?",
            id
        );
    }
    
}