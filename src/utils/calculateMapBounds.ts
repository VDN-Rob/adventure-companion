type Coordinate = {
    latitude: number;
    longitude: number;
};

export function calculateBounds(coordinates: Coordinate[]) {
    if (coordinates.length === 0) {
        return null;
    }

    const latitudes = coordinates.map(c => c.latitude);
    const longitudes = coordinates.map(c => c.longitude);


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