import { DaysRepository } from "@/database/dayRepository";
import { PoisRepository } from "@/database/poiRepository";
import { TripsRepository } from "@/database/tripRepository";
import { calculateBounds } from "@/utils/calculateMapBounds";
import { combineBounds, MapBounds } from "@/utils/combineMapBounds";

interface MapRegion {
    name: string;
    bounds: MapBounds;
}

export class TripMapServices {
    constructor (
        private tripsRepository: TripsRepository,
        private daysRepository: DaysRepository,
        private poisRepository: PoisRepository,
    ) {}
    // Queries
    async getTripMapRegions(
        tripId: string,
        mode: "trip" | "day"
    ): Promise<MapRegion[]> {
    
        const days = await this.daysRepository.getAllDayForTrip(tripId);
    
        const regions: MapRegion[] = [];
    
        for (const day of days) {
    
            const pois = await this.poisRepository.getAllPOIsForDay(day.id);
    
            const coordinates = pois
                .filter(
                    poi =>
                        poi.latitude !== null &&
                        poi.longitude !== null
                )
                .map(poi => ({
                    latitude: poi.latitude!,
                    longitude: poi.longitude!,
                }));
    
            if (coordinates.length === 0) {
                continue;
            }
    
            const bounds = calculateBounds(coordinates);
    
            if (!bounds) {
                continue;
            }
    
            regions.push({
                name: `Day ${day.date}`,
                bounds: [
                    bounds.minLng,
                    bounds.minLat,
                    bounds.maxLng,
                    bounds.maxLat,
                ],
            });
        }
    
        if (mode === "day") {
            return regions;
        }
    
        const combinedBounds = combineBounds(
            regions.map(region => region.bounds)
        );
    
        if (!combinedBounds) {
            return [];
        }
    
        return [
            {
                name: "Entire trip",
                bounds: combinedBounds,
            },
        ];
    }

    // Scripts
    calculateRegions() {}
    expandRegions() {}
    mergeRegions() {}
}

interface TripStatistics {
    totalDistance: number,
    totalElevation: number
}