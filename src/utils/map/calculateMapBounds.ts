type Coordinate = {
    latitude: number;
    longitude: number;
};


/**
 * Calculates the geographic bounds containing all provided coordinates.
 *
 * A small area is added around a single latitude or longitude so that a
 * single-point result can still be displayed meaningfully on a map.
 */
export function calculateBounds(coordinates: Coordinate[]) {
    if (coordinates.length === 0) {
        return null;
    }

    const latitudes = coordinates.map((coordinate) => coordinate.latitude);
    const longitudes = coordinates.map((coordinate) => coordinate.longitude);


    let minLat = Math.min(...latitudes);
    let maxLat = Math.max(...latitudes);
    let minLng = Math.min(...longitudes);
    let maxLng = Math.max(...longitudes);

    // Give a single point some area to display
    if (minLat === maxLat) {
        minLat -= 0.01;
        maxLat += 0.01;
    }

    if (minLng === maxLng) {
        minLng -= 0.01;
        maxLng += 0.01;
    }

    return {
        minLat,
        maxLat,
        minLng,
        maxLng,
    };
}