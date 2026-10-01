import { Route, TrackPoint } from "@/models/Route";
import * as Crypto from "expo-crypto";
import { SQLiteDatabase } from "expo-sqlite";

type RouteRow = {
    id: string;
    day_id: string;
    name: string | null;
    distance_meters: number | null;
    elevation_gain_meters: number | null;
    elevation_loss_meters: number | null;
    imported_at: string;
    file_path: string;
};

type TrackPointRow = {
    id: string;
    route_id: string;
    latitude: number;
    longitude: number;
    elevation: number | null;
    timestamp: string | null;
};

export class RoutesRepository {
    constructor(
        private readonly db: SQLiteDatabase
    ) {}

    async createRoute(route: Route): Promise<void> {
        await this.db.withTransactionAsync(async () => {
            await this.db.runAsync(
                `
                INSERT INTO routes (
                    id,
                    day_id,
                    name,
                    distance_meters,
                    elevation_gain_meters,
                    elevation_loss_meters,
                    imported_at,
                    file_path
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                route.id,
                route.dayId,
                route.name ?? null,
                route.distanceMeters ?? null,
                route.elevationGainMeters ?? null,
                route.elevationLossMeters ?? null,
                route.importedAt,
                route.filePath
            );

            for (let index = 0; index < route.trackPoints.length; index++) {
                const trackPoint = route.trackPoints[index];
            
                await this.db.runAsync(
                    `
                    INSERT INTO trackpoints (
                        id,
                        route_id,
                        sequence,
                        latitude,
                        longitude,
                        elevation,
                        timestamp
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    `,
                    Crypto.randomUUID(),
                    route.id,
                    index,
                    trackPoint.latitude,
                    trackPoint.longitude,
                    trackPoint.elevation ?? null,
                    trackPoint.timestamp ?? null
                );
            }
        });
    }

    async getRouteById(id: string): Promise<Route | null> {
        const routeRow = await this.db.getFirstAsync<RouteRow>(
            `
            SELECT *
            FROM routes
            WHERE id = ?
            `,
            id
        );

        if (!routeRow) {
            return null;
        }

        const trackPointRows =
            await this.db.getAllAsync<TrackPointRow>(
                `
                SELECT *
                FROM trackpoints
                WHERE route_id = ?
                ORDER BY sequence ASC
                `,
                id
            );

        return this.mapRowsToRoute(
            routeRow,
            trackPointRows
        );
    }

    async getRoutesForDay(dayId: string): Promise<Route[]> {
        const routeRows = await this.db.getAllAsync<RouteRow>(
                `
                SELECT *
                FROM routes
                WHERE day_id = ?
                ORDER BY imported_at ASC
                `,
                dayId
            );

        const routes: Route[] = [];

        for (const routeRow of routeRows) {
            const trackPointRows = await this.db.getAllAsync<TrackPointRow>(
                    `
                    SELECT *
                    FROM trackpoints
                    WHERE route_id = ?
                    ORDER BY rowid ASC
                    `,
                    routeRow.id
                );

            routes.push(
                this.mapRowsToRoute(
                    routeRow,
                    trackPointRows
                )
            );
        }

        return routes;
    }

    async deleteRoute(id: string): Promise<void> {
        await this.db.withTransactionAsync(async () => {
            await this.db.runAsync(
                `
                DELETE FROM trackpoints
                WHERE route_id = ?
                `,
                id
            );

            await this.db.runAsync(
                `
                DELETE FROM routes
                WHERE id = ?
                `,
                id
            );
        });
    }

    private mapRowsToRoute(
        routeRow: RouteRow,
        trackPointRows: TrackPointRow[]
    ): Route {
        return {
            id: routeRow.id,
            dayId: routeRow.day_id,
            name: routeRow.name ?? undefined,

            distanceMeters: routeRow.distance_meters ?? undefined,

            elevationGainMeters: routeRow.elevation_gain_meters ?? undefined,

            elevationLossMeters: routeRow.elevation_loss_meters ?? undefined,

            trackPoints: trackPointRows.map(this.mapRowToTrackPoint),

            importedAt: routeRow.imported_at,
            filePath: routeRow.file_path,
        };
    }

    private mapRowToTrackPoint(row: TrackPointRow): TrackPoint {
        return {
            latitude: row.latitude,
            longitude: row.longitude,
            elevation: row.elevation ?? undefined,
            timestamp: row.timestamp ?? undefined,
        };
    }
}