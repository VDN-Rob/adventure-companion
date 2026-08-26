export type MapBounds = [
    number, // west
    number, // south
    number, // east
    number  // north
];

export function combineBounds(
    boundsList: MapBounds[]
): MapBounds | null {

    if (boundsList.length === 0) {
        return null;
    }

    let west = boundsList[0][0];
    let south = boundsList[0][1];
    let east = boundsList[0][2];
    let north = boundsList[0][3];

    for (const bounds of boundsList.slice(1)) {
        west = Math.min(west, bounds[0]);
        south = Math.min(south, bounds[1]);
        east = Math.max(east, bounds[2]);
        north = Math.max(north, bounds[3]);
    }

    return [west, south, east, north];
}