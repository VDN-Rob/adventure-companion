import { OfflineMap } from "@/models/OfflineMap";
import { SQLiteDatabase } from "expo-sqlite";

type OfflineMapRow = {
    id: string;
    offline_region_id: string;
	name: string | null;
    
	min_zoom: number;
    max_zoom: number;
    
	west: number;
    south: number;
    east: number;
    north: number;
    
	creation_date: string;
};



/**
 * Provides SQLite persistence operations for offline maps.
 */
export class OfflineMapsRepository {
    constructor(private db: SQLiteDatabase) {}


	/**
	 * Returns all offline maps ordered from newest to oldest.
	 */
    async getMaps(): Promise<OfflineMap[]> {
        const rows = await this.db.getAllAsync<OfflineMapRow>(
            `SELECT * FROM offline_maps ORDER BY creation_date DESC`
        );

        return rows.map(row => this.mapRowToOfflineMap(row));
    }


	/**
	 * Returns an offline map by its ID.
	 */
    async getMapById(id: string): Promise<OfflineMap | null>  {
        const row = await this.db.getFirstAsync<OfflineMapRow>(
            "SELECT * FROM offline_maps WHERE id = ?",
            id
        );

        return row ? this.mapRowToOfflineMap(row) : null;
    }


	/**
	 * Maps a SQLite row to the domain OfflineMap model.
	 */
    private mapRowToOfflineMap(row: OfflineMapRow): OfflineMap {
        return {
            id: row.id,
            offlineRegionId: row.offline_region_id,
            name: row.name,
            minZoom: row.min_zoom,
            maxZoom: row.max_zoom,
            west: row.west,
            south: row.south,
            east: row.east,
            north: row.north,
            creationDate: row.creation_date
        };
    }



	/**
	 * Persists a new offline map.
	 */
    async createMap(map: OfflineMap) {
        return this.db.runAsync(
            `
				INSERT INTO offline_maps (
					id,
					offline_region_id,
					name,
					min_zoom,
					max_zoom,
					west,
					south,
					east,
					north,
					creation_date
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
            map.id,
            map.offlineRegionId,
            map.name,
            map.minZoom,
            map.maxZoom,
            map.west,
            map.south,
            map.east,
            map.north,
            map.creationDate
        )
    }

	/**
	 * Deletes an offline map by ID.
	 */
    async deleteMap(id: string) {
        return this.db.runAsync(
            "DELETE FROM offline_maps WHERE id = ?",
            id
        );
    }
}