import { Route, TrackPoint } from "@/models/Route";

export interface RouteProgress {
    routeId: string;
    nearestPoint: TrackPoint;
    nearestPointIndex: number;
    distanceFromRouteMeters: number;
    distanceTravelledMeters: number;
    distanceRemainingMeters: number;
    progress: number;
    offRoute: boolean;
}

export class RouteNavigationService {
    private readonly offRouteThresholdMeters = 50;

    getProgress(
        route: Route,
        latitude: number,
        longitude: number,
    ): RouteProgress | null {
        if (route.trackPoints.length < 2) {
            return null;
        }

        let nearestPointIndex = 0;
        let nearestDistance = Infinity;

        for (let i = 0; i < route.trackPoints.length; i++) {
            const point = route.trackPoints[i];

            const distance = this.distanceMeters(
                latitude,
                longitude,
                point.latitude,
                point.longitude,
            );

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestPointIndex = i;
            }
        }

        const distanceTravelled = this.calculateDistanceUntil(
            route.trackPoints,
            nearestPointIndex,
        );

        const totalDistance =
            route.distanceMeters ??
            this.calculateRouteDistance(route.trackPoints);

        const distanceRemaining = Math.max(
            0,
            totalDistance - distanceTravelled,
        );

        return {
            routeId: route.id,
            nearestPoint: route.trackPoints[nearestPointIndex],
            nearestPointIndex,
            distanceFromRouteMeters: nearestDistance,
            distanceTravelledMeters: distanceTravelled,
            distanceRemainingMeters: distanceRemaining,
            progress:
                totalDistance > 0
                    ? distanceTravelled / totalDistance
                    : 0,
            offRoute:
                nearestDistance > this.offRouteThresholdMeters,
        };
    }

    private calculateDistanceUntil(
        points: TrackPoint[],
        endIndex: number,
    ): number {
        let distance = 0;

        for (let i = 1; i <= endIndex; i++) {
            distance += this.distanceMeters(
                points[i - 1].latitude,
                points[i - 1].longitude,
                points[i].latitude,
                points[i].longitude,
            );
        }

        return distance;
    }

    private calculateRouteDistance(points: TrackPoint[]): number {
        let distance = 0;

        for (let i = 1; i < points.length; i++) {
            distance += this.distanceMeters(
                points[i - 1].latitude,
                points[i - 1].longitude,
                points[i].latitude,
                points[i].longitude,
            );
        }

        return distance;
    }

    private distanceMeters(
        latitude1: number,
        longitude1: number,
        latitude2: number,
        longitude2: number,
    ): number {
        const earthRadius = 6_371_000;

        const lat1 = this.toRadians(latitude1);
        const lat2 = this.toRadians(latitude2);
        const deltaLat = this.toRadians(latitude2 - latitude1);
        const deltaLng = this.toRadians(longitude2 - longitude1);

        const a =
            Math.sin(deltaLat / 2) ** 2 +
            Math.cos(lat1) *
                Math.cos(lat2) *
                Math.sin(deltaLng / 2) ** 2;

        const c =
            2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    }

    private toRadians(value: number): number {
        return (value * Math.PI) / 180;
    }
}