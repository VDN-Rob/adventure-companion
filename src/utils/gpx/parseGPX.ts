import { TrackPoint } from "@/models/Route";
import { XMLParser } from "fast-xml-parser";

type GPXTrackPoint = {
    "@_lat": string | number;
    "@_lon": string | number;
    ele?: string | number;
    time?: string;
};

type GPXTrackSegment = {
    trkpt?: GPXTrackPoint | GPXTrackPoint[];
};

type GPXTrack = {
    name?: string;
    trkseg?: GPXTrackSegment | GPXTrackSegment[];
};

type GPXDocument = {
    gpx?: {
        trk?: GPXTrack | GPXTrack[];
    };
};

export interface ParsedGPX {
    name?: string;
    trackPoints: TrackPoint[];
}

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true,
});

export function parseGPX(xml: string): ParsedGPX {
    const document = parser.parse(xml) as GPXDocument;

    const tracks = document.gpx?.trk;

    if (!tracks) {
        throw new Error("The GPX file does not contain a track.");
    }

    const trackList = Array.isArray(tracks)
        ? tracks
        : [tracks];

    const trackPoints: TrackPoint[] = [];

    let name: string | undefined;

    for (const track of trackList) {
        if (!name && typeof track.name === "string") {
            name = track.name;
        }

        const segments = track.trkseg
            ? Array.isArray(track.trkseg)
                ? track.trkseg
                : [track.trkseg]
            : [];

        for (const segment of segments) {
            if (!segment.trkpt) {
                continue;
            }

            const points = Array.isArray(segment.trkpt)
                ? segment.trkpt
                : [segment.trkpt];

            for (const point of points) {
                const latitude = Number(point["@_lat"]);
                const longitude = Number(point["@_lon"]);

                if (
                    !Number.isFinite(latitude) ||
                    !Number.isFinite(longitude)
                ) {
                    continue;
                }

                const trackPoint: TrackPoint = {
                    latitude,
                    longitude,
                };

                if (point.ele !== undefined) {
                    const elevation = Number(point.ele);

                    if (Number.isFinite(elevation)) {
                        trackPoint.elevation = elevation;
                    }
                }

                if (point.time) {
                    trackPoint.timestamp = point.time;
                }

                trackPoints.push(trackPoint);
            }
        }
    }

    if (trackPoints.length === 0) {
        throw new Error(
            "The GPX file does not contain any valid track points."
        );
    }

    return {
        name,
        trackPoints,
    };
}