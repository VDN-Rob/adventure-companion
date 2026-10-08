import { Route, TrackPoint } from "@/models/Route";
import { projectPointOntoSegment } from "@/utils/map/projectPointOntoSegment";

export interface RouteProgress {
    distanceFromStartMeters: number;
    distanceRemainingMeters: number;
    percentage: number;

    nearestPoint: TrackPoint;
    distanceFromRouteMeters: number;

    segmentIndex: number;
}

interface PreparedRouteSegment {
    start: TrackPoint;
    end: TrackPoint;
    lengthMeters: number;
    distanceFromStartMeters: number;
}

interface PreparedRoute {
    segments: PreparedRouteSegment[];
    totalDistanceMeters: number;
}

interface NavigationState {
    segmentIndex: number;
    distanceFromStartMeters: number;
    distanceFromRouteMeters: number;
}

const EARTH_RADIUS_METERS = 6_371_000;
const PROGRESS_BACKTRACK_TOLERANCE_METERS = 15;
const MAX_ROUTE_DISTANCE_FOR_PROGRESS_METERS = 100;


export class RouteNavigationService {
    private preparedRoutes = new Map<string, PreparedRoute>();
    private navigationStates = new Map<string, NavigationState>();

    private toRadians(value: number): number {
        return (value * Math.PI) / 180;
    }

    private stabilizeDistance(
        routeId: string,
        distanceFromStartMeters: number,
        segmentIndex: number,
        distanceFromRouteMeters: number,
    ): number {
        const previous = this.navigationStates.get(routeId);

        if (!previous) {
            this.navigationStates.set(routeId, {
                segmentIndex,
                distanceFromStartMeters,
                distanceFromRouteMeters,
            });

            return distanceFromStartMeters;
        }

        const difference = distanceFromStartMeters - previous.distanceFromStartMeters;

        const isCloseToRoute = distanceFromRouteMeters <= MAX_ROUTE_DISTANCE_FOR_PROGRESS_METERS;

        if (isCloseToRoute && difference < -PROGRESS_BACKTRACK_TOLERANCE_METERS) {
            this.navigationStates.set(routeId, {
                segmentIndex,
                distanceFromStartMeters: previous.distanceFromStartMeters,
                distanceFromRouteMeters,
            });

            return previous.distanceFromStartMeters;
        }

        this.navigationStates.set(routeId, {
            segmentIndex,
            distanceFromStartMeters,
            distanceFromRouteMeters,
        });

        return distanceFromStartMeters;
    }

    private distanceBetween(first: TrackPoint, second: TrackPoint,): number {
        const lat1 = this.toRadians(first.latitude);
        const lat2 = this.toRadians(second.latitude);

        const deltaLat = this.toRadians(second.latitude - first.latitude,);

        const deltaLng = this.toRadians(second.longitude - first.longitude);

        const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

        return (2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    private prepareRoute(route: Route): PreparedRoute {
        const cached = this.preparedRoutes.get(route.id);

        if (cached) {
            return cached;
        }

        const segments: PreparedRouteSegment[] = [];
        let totalDistanceMeters = 0;

        for (
            let index = 0;
            index < route.trackPoints.length - 1;
            index++
        ) {
            const start = route.trackPoints[index];
            const end = route.trackPoints[index + 1];

            const lengthMeters = this.distanceBetween(start, end);

            segments.push({
                start,
                end,
                lengthMeters,
                distanceFromStartMeters:
                    totalDistanceMeters,
            });

            totalDistanceMeters += lengthMeters;
        }

        const preparedRoute: PreparedRoute = {
            segments,
            totalDistanceMeters,
        };

        this.preparedRoutes.set(
            route.id,
            preparedRoute,
        );

        return preparedRoute;
    }

    calculateProgress(route: Route, location: TrackPoint): RouteProgress | null {
        const preparedRoute = this.prepareRoute(route);

        if (preparedRoute.segments.length === 0) {
            return null;
        }

        let bestSegment:
            | PreparedRouteSegment
            | null = null;

        let bestSegmentIndex = -1;
        let bestSegmentProgress = 0;
        let bestDistanceFromRoute = Infinity;

        for (
            let index = 0;
            index < preparedRoute.segments.length;
            index++
        ) {
            const segment = preparedRoute.segments[index];

            const projection =
                projectPointOntoSegment(location, segment.start, segment.end);

            if (projection.distanceMeters < bestDistanceFromRoute) {
                bestDistanceFromRoute = projection.distanceMeters;

                bestSegment = segment;
                bestSegmentIndex = index;
                bestSegmentProgress = projection.segmentProgress;
            }
        }

        if (!bestSegment) {
            return null;
        }

        const distanceFromStartMeters = bestSegment.distanceFromStartMeters + bestSegment.lengthMeters * bestSegmentProgress;
        const stabilizedDistance = this.stabilizeDistance(
            route.id,
            distanceFromStartMeters,
            bestSegmentIndex,
            bestDistanceFromRoute,
        );

        const totalDistanceMeters = route.distanceMeters ?? preparedRoute.totalDistanceMeters;

        if (totalDistanceMeters <= 0) {
            return null;
        }

        const percentage = Math.max(0, Math.min(100, (stabilizedDistance / totalDistanceMeters) * 100));

        return {
            distanceFromStartMeters: stabilizedDistance,
                distanceRemainingMeters: Math.max(0, totalDistanceMeters - stabilizedDistance),
            percentage,
            nearestPoint: {
                latitude: bestSegment.start.latitude + (bestSegment.end.latitude - bestSegment.start.latitude) * bestSegmentProgress,
                longitude: bestSegment.start.longitude + (bestSegment.end.longitude - bestSegment.start.longitude) * bestSegmentProgress,
            },
            distanceFromRouteMeters: bestDistanceFromRoute,
            segmentIndex: bestSegmentIndex,
        };
    }

    reset(routeId: string): void {
        this.navigationStates.delete(routeId);
    }
}