import { OfflineMap } from "@/models/OfflineMap";
import { SQLiteDatabase } from "expo-sqlite";

type OfflineMapRow = {
    id: string;
    offline_region_id: string;
    name: string;
    min_zoom: number;
    max_zoom: number;
    west: number;
    south: number;
    east: number;
    north: number;
    creation_date: string;
  };

export class MapsRepository {

    constructor(private db: SQLiteDatabase) {}

    async createMap(map: OfflineMap) {
        return this.db.runAsync(
            `INSERT INTO maps (id, offline_region_id, name, min_zoom, max_zoom, west, south, east, north)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    async getMaps(): Promise<OfflineMap[]> {
        const rows = await this.db.getAllAsync<OfflineMapRow>(
            `SELECT * FROM maps`
        );

        return rows.map(row => this.mapRowToOfflineMap(row));
    }

    async getMapById(id: string) {
        const row = await this.db.getFirstAsync<OfflineMapRow>(
            "SELECT * FROM maps WHERE id = ?",
            id
        );

        if (!row) return null;

        return this.mapRowToOfflineMap(row);
    }

    // Small helper function to map database to react
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

    async deleteMap(id: string) {
        return this.db.runAsync(
            "DELETE FROM maps WHERE id = ?",
            id
        );
    }
}