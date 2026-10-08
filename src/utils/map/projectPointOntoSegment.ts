import { TrackPoint } from "@/models/Route";

export interface ProjectedRoutePoint {
    latitude: number;
    longitude: number;
    segmentIndex: number;
    segmentProgress: number;
    distanceMeters: number;
}

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(value: number): number {
    return (value * Math.PI) / 180;
}

function haversineDistance(
    first: TrackPoint,
    second: TrackPoint,
): number {
    const lat1 = toRadians(first.latitude);
    const lat2 = toRadians(second.latitude);
    const deltaLat = toRadians(second.latitude - first.latitude);
    const deltaLng = toRadians(second.longitude - first.longitude);

    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLng / 2) ** 2;

    return (
        2 *
        EARTH_RADIUS_METERS *
        Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    );
}

function projectToLocalCoordinates(
    point: TrackPoint,
    referenceLatitude: number,
): { x: number; y: number } {
    const latitudeScale = Math.PI / 180;
    const longitudeScale =
        Math.cos(toRadians(referenceLatitude)) *
        latitudeScale;

    return {
        x: point.longitude * longitudeScale * EARTH_RADIUS_METERS,
        y: point.latitude * latitudeScale * EARTH_RADIUS_METERS,
    };
}

export function projectPointOntoSegment(
    position: TrackPoint,
    start: TrackPoint,
    end: TrackPoint,
): ProjectedRoutePoint {
    const referenceLatitude =
        (start.latitude + end.latitude + position.latitude) / 3;

    const p = projectToLocalCoordinates(
        position,
        referenceLatitude,
    );

    const a = projectToLocalCoordinates(
        start,
        referenceLatitude,
    );

    const b = projectToLocalCoordinates(
        end,
        referenceLatitude,
    );

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const segmentLengthSquared =
        dx * dx + dy * dy;

    const rawProgress =
        segmentLengthSquared === 0
            ? 0
            : ((p.x - a.x) * dx +
                  (p.y - a.y) * dy) /
              segmentLengthSquared;

    const segmentProgress = Math.max(
        0,
        Math.min(1, rawProgress),
    );

    const projectedX =
        a.x + dx * segmentProgress;
    const projectedY =
        a.y + dy * segmentProgress;

    const longitudeScale =
        Math.cos(toRadians(referenceLatitude)) *
        (Math.PI / 180) *
        EARTH_RADIUS_METERS;

    const latitudeScale =
        (Math.PI / 180) * EARTH_RADIUS_METERS;

    const projectedLongitude =
        projectedX / longitudeScale;

    const projectedLatitude =
        projectedY / latitudeScale;

    const projectedPoint: TrackPoint = {
        latitude: projectedLatitude,
        longitude: projectedLongitude,
    };

    const distanceMeters = haversineDistance(
        position,
        projectedPoint,
    );

    return {
        latitude: projectedLatitude,
        longitude: projectedLongitude,
        segmentIndex: 0,
        segmentProgress,
        distanceMeters,
    };
}