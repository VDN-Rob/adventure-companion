import { DaysRepository } from "@/database/dataAccessLayer/dayRepository";
import { POIsRepository } from "@/database/dataAccessLayer/poiRepository";
import { RoutesRepository } from "@/database/dataAccessLayer/routeRepository";
import { TripsRepository } from "@/database/dataAccessLayer/tripRepository";
import { calculateBounds } from "@/utils/map/calculateMapBounds";
import { combineBounds, MapBounds } from "@/utils/map/combineMapBounds";

interface MapRegion {
    name: string;
    bounds: MapBounds;
}

export class TripMapServices {
    constructor (
        private tripsRepository: TripsRepository,
        private daysRepository: DaysRepository,
        private poisRepository: POIsRepository,
        private routesRepository: RoutesRepository,
    ) {}

    async getTripMapRegions(tripId: string, mode: "trip" | "day"): Promise<MapRegion[]> {
        const days = await this.daysRepository.getAllDaysForTrip(tripId);
    
        const regions: MapRegion[] = [];
    
        for (const day of days) {
            const coordinates = await this.getCoordinates(day.id);
    
            if (coordinates.length === 0) {
                continue;
            }
    
            const bounds = calculateBounds(coordinates);
    
            if (!bounds) {
                continue;
            }
    
            regions.push({
                name: day.date,
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
    
        const currentTrip = await this.tripsRepository.getTripById(tripId);
        return [
            {
                name: currentTrip ? currentTrip.name : "Entire trip",
                bounds: combinedBounds,
            },
        ];
    }

    async getDayMapRegion(dayId: string): Promise<MapRegion | null> {
        const day = await this.daysRepository.getDayById(dayId);
    
        if (!day) {
            return null;
        }

        const coordinates = await this.getCoordinates(day.id);
    
        if (coordinates.length === 0) {
            return null;
        }
    
        const bounds = calculateBounds(coordinates);
    
        if (!bounds) {
            return null;
        }
    
        return {
            name: day.date,
            bounds: [
                bounds.minLng,
                bounds.minLat,
                bounds.maxLng,
                bounds.maxLat,
            ],
        };
    }

    private async getCoordinates(dayId: string) {
        const pois = await this.poisRepository.getAllPOIsForDay(dayId);
        const routes = await this.routesRepository.getRoutesForDay(dayId);
    
        return [
            ...pois
                .filter(
                    (poi) =>
                        poi.latitude !== null &&
                        poi.longitude !== null
                )
                .map((poi) => ({
                    latitude: poi.latitude!,
                    longitude: poi.longitude!,
                })),
        
            ...routes.flatMap((route) =>
                route.trackPoints.map((point) => ({
                    latitude: point.latitude,
                    longitude: point.longitude,
                }))
            ),
        ];
    }
}