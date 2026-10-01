import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";

import { RoutesRepository } from "@/database/dataAccessLayer/routeRepository";
import { Route, TrackPoint } from "@/models/Route";
import { parseGPX } from "@/utils/gpx/parseGPX";

export class RouteService {
    constructor(
        private readonly routesRepository: RoutesRepository
    ) {}

    async importGPX(
        dayId: string,
        filePath: string
    ): Promise<Route> {
        const xml = await FileSystem.readAsStringAsync(
            filePath,
            {
                encoding: FileSystem.EncodingType.UTF8,
            }
        );

        const parsed = parseGPX(xml);

        const route: Route = {
            id: Crypto.randomUUID(),
            dayId,

            name: parsed.name,

            distanceMeters:
                this.calculateDistanceMeters(
                    parsed.trackPoints
                ),

            elevationGainMeters:
                this.calculateElevationGain(
                    parsed.trackPoints
                ),

            elevationLossMeters:
                this.calculateElevationLoss(
                    parsed.trackPoints
                ),

            trackPoints: parsed.trackPoints,

            importedAt: new Date().toISOString(),
            filePath,
        };

        await this.routesRepository.createRoute(route);

        return route;
    }

    async getRouteById(routeId: string): Promise<Route | null> {
        return this.routesRepository.getRouteById(routeId);
    }

    async getRoutesForDay(dayId: string): Promise<Route[]> {
        return this.routesRepository.getRoutesForDay(dayId);
    }

    async deleteRoute(routeId: string): Promise<void> {
        const route =
            await this.routesRepository.getRouteById(routeId);

        if (!route) {
            return;
        }

        await this.routesRepository.deleteRoute(routeId);

        // The original GPX file is intentionally not deleted
        // here yet. The file may be outside our application's
        // cache/storage directory.
    }

    private calculateDistanceMeters(
        points: TrackPoint[]
    ): number {
        let distance = 0;

        for (let i = 1; i < points.length; i++) {
            distance += this.distanceBetweenPoints(
                points[i - 1],
                points[i]
            );
        }

        return distance;
    }

    private calculateElevationGain(
        points: TrackPoint[]
    ): number {
        let gain = 0;

        for (let i = 1; i < points.length; i++) {
            const previous = points[i - 1].elevation;
            const current = points[i].elevation;

            if (
                previous === undefined ||
                current === undefined
            ) {
                continue;
            }

            const difference = current - previous;

            if (difference > 0) {
                gain += difference;
            }
        }

        return gain;
    }

    private calculateElevationLoss(
        points: TrackPoint[]
    ): number {
        let loss = 0;

        for (let i = 1; i < points.length; i++) {
            const previous = points[i - 1].elevation;
            const current = points[i].elevation;

            if (
                previous === undefined ||
                current === undefined
            ) {
                continue;
            }

            const difference = previous - current;

            if (difference > 0) {
                loss += difference;
            }
        }

        return loss;
    }

    private distanceBetweenPoints(
        first: TrackPoint,
        second: TrackPoint
    ): number {
        const earthRadiusMeters = 6_371_000;

        const lat1 = this.toRadians(first.latitude);
        const lat2 = this.toRadians(second.latitude);

        const deltaLat = this.toRadians(
            second.latitude - first.latitude
        );

        const deltaLng = this.toRadians(
            second.longitude - first.longitude
        );

        const a =
            Math.sin(deltaLat / 2) ** 2 +
            Math.cos(lat1) *
                Math.cos(lat2) *
                Math.sin(deltaLng / 2) ** 2;

        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        return earthRadiusMeters * c;
    }

    private toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}