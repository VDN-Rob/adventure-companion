import { MapBounds } from "./combineMapBounds";

const EPSILON = 0.0000001;

/**
 * Returns true when the outer bounds completely contain the inner bounds.
 */
export function containsBounds(
    outer: MapBounds,
    inner: MapBounds
): boolean {
    return (
        outer[0] <= inner[0] + EPSILON &&
        outer[1] <= inner[1] + EPSILON &&
        outer[2] >= inner[2] - EPSILON &&
        outer[3] >= inner[3] - EPSILON
    );
}

/**
 * Returns true when two bounds overlap with a non-zero area.
 */
export function intersectsBounds(
    first: MapBounds,
    second: MapBounds
): boolean {
    return !(
        first[2] <= second[0] + EPSILON ||
        first[0] >= second[2] - EPSILON ||
        first[3] <= second[1] + EPSILON ||
        first[1] >= second[3] - EPSILON
    );
}

/**
 * Removes the area covered by `existing` from `requested`.
 *
 * The result contains zero or more rectangular areas that are still
 * required to completely cover `requested`.
 */
export function subtractBounds(
    requested: MapBounds,
    existing: MapBounds
): MapBounds[] {
    if (!intersectsBounds(requested, existing)) {
        return [requested];
    }

    if (containsBounds(existing, requested)) {
        return [];
    }

    const [
        requestedWest,
        requestedSouth,
        requestedEast,
        requestedNorth,
    ] = requested;

    const [
        existingWest,
        existingSouth,
        existingEast,
        existingNorth,
    ] = existing;

    const intersectionWest = Math.max(
        requestedWest,
        existingWest
    );

    const intersectionSouth = Math.max(
        requestedSouth,
        existingSouth
    );

    const intersectionEast = Math.min(
        requestedEast,
        existingEast
    );

    const intersectionNorth = Math.min(
        requestedNorth,
        existingNorth
    );

    const remaining: MapBounds[] = [];

    // Area west of the intersection.
    if (requestedWest < intersectionWest - EPSILON) {
        remaining.push([
            requestedWest,
            requestedSouth,
            intersectionWest,
            requestedNorth,
        ]);
    }

    // Area east of the intersection.
    if (intersectionEast < requestedEast - EPSILON) {
        remaining.push([
            intersectionEast,
            requestedSouth,
            requestedEast,
            requestedNorth,
        ]);
    }

    // Area south of the intersection.
    if (requestedSouth < intersectionSouth - EPSILON) {
        remaining.push([
            intersectionWest,
            requestedSouth,
            intersectionEast,
            intersectionSouth,
        ]);
    }

    // Area north of the intersection.
    if (intersectionNorth < requestedNorth - EPSILON) {
        remaining.push([
            intersectionWest,
            intersectionNorth,
            intersectionEast,
            requestedNorth,
        ]);
    }

    return remaining;
}