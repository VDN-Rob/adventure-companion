import { POI, POIType } from "@/models/POI";
import { SQLiteDatabase } from "expo-sqlite";

type PoiRow = {
    id: string;
    day_id: string;

    name: string;
    type: POIType;

    latitude: number | null;
    longitude: number | null;

    notes: string | null;
    visited_at: string | null;
};

/**
 * Provides SQLite persistence operations for points of interest.
 */
export class POIsRepository {
    constructor(private db: SQLiteDatabase) {}


	/**
	 * Returns all points of interest belonging to a day.
	 */
    async getAllPOIsForDay(dayId: string): Promise<POI[]> {
        const rows = await this.db.getAllAsync<PoiRow>(
            "SELECT * FROM pois WHERE day_id = ? ORDER BY name ASC",
            dayId
        );
        
        return rows.map((row) => this.mapRowToPOI(row));
    }


	/**
	 * Returns a point of interest by its ID.
	 */
    async getPOIById(id: string): Promise<POI | null> {
        const row = await this.db.getFirstAsync<PoiRow>(
            "SELECT * FROM pois WHERE id = ?",
            id
        );

        return row ? this.mapRowToPOI(row) : null;
    }

	/**
	 * Maps a SQLite row to the domain POI model.
	 */
	private mapRowToPOI(row: PoiRow): POI {
        return {
            id: row.id,
            dayId: row.day_id,
            name: row.name,
            type: row.type,
            latitude: row.latitude,
            longitude: row.longitude,
            notes: row.notes,
            visitedAt: row.visited_at
        };
    }

	/**
	 * Persists a new point of interest.
	 */
    async createPOI(poi: POI) {
        return this.db.runAsync(
            `
				INSERT INTO pois (
					id,
					day_id,
					name,
					type,
					latitude,
					longitude,
					notes,
					visited_at
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            poi.id,
            poi.dayId,
            poi.name,
            poi.type,
            poi.latitude,
            poi.longitude,
            poi.notes,
            poi.visitedAt
        );
    }

	/**
	 * Updates an existing point of interest.
	 */
    async updatePOI(poi: POI) {
        return this.db.runAsync(
            `
				UPDATE pois
				SET name = ?,
					type = ?,
					latitude = ?,
					longitude = ?,
					notes = ?,
					visited_at = ?
				WHERE id = ?
			`,
            poi.name,
            poi.type,
            poi.latitude,
            poi.longitude,
            poi.notes,
            poi.visitedAt,
            poi.id
        );
    }


	/**
	 * Updates only the visited date of a point of interest.
	 */
    async updatePOIVisitedAt(poiId: string, visitedAt: string | null): Promise<void> {
        await this.db.runAsync(
            `
				UPDATE pois
				SET visited_at = ?
				WHERE id = ?
            `,
            visitedAt,
            poiId
        );
    }


	/**
	 * Deletes a point of interest by ID.
	 */
    async deletePOI(id: string) {
        return this.db.runAsync(
            "DELETE FROM pois WHERE id = ?",
            id
        );
    }
    
}