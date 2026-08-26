import { MAP_STYLE } from "@/constants/map";
import { DaysRepository } from "@/database/dayRepository";
import { TripsRepository } from "@/database/tripRepository";
import { OfflineManager } from "@maplibre/maplibre-react-native";

export class MapServices {
    constructor (
        private tripsRepository: TripsRepository,
        private daysRepository: DaysRepository
    ) {}

    // Queries
    getDownloadProgress() {}
    
    getDownloadedRegions() {}

    // Scripts
    async downloadRegion(
        bounds: [number, number, number, number]
    ) {
        const offlinePack = await OfflineManager.createPack(
            {
                mapStyle: MAP_STYLE,
                minZoom: 5,
                maxZoom: 15,
                bounds,
                metadata: {
                    name: "cycling-trip",
                },
            },
            (pack, status) => {
                console.log("Download:", status);
            },
            (pack, error) => {
                console.error("Map download error:", error);
            }
        );

        return offlinePack;
    }

    deleteRegion() {}
}