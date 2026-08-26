import { MAP_STYLE } from "@/constants/map";
import { MapsRepository } from "@/database/mapsRepository";
import { OfflineMap } from "@/models/OfflineMap";
import { MapBounds } from "@/utils/combineMapBounds";
import { OfflineManager } from "@maplibre/maplibre-react-native";
import * as Crypto from "expo-crypto";

export class MapServices {
    constructor (
        private mapsRepository: MapsRepository
    ) {}

    // Queries
    getDownloadProgress() {}
    
    getDownloadedRegions() {
        return this.mapsRepository.getMaps();
    }

    // Scripts
    async downloadRegion(
        name: string,
        bounds: MapBounds,
        minZoom = 8,
        maxZoom = 15
    ): Promise<OfflineMap> {
        const id = Crypto.randomUUID();

        const offlineRegionId =
            `region-${id}`;

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

        const map: OfflineMap = {
            id,
            offlineRegionId,
            name,

            minZoom,
            maxZoom,

            west: bounds[0],
            south: bounds[1],
            east: bounds[2],
            north: bounds[3],

            creationDate: "26.08.2026"
        };

        await this.mapsRepository.createMap(map);

        return map;

    }

    async deleteRegion(mapId: string) {
        // MapLibre deletion
        // database deletion
    }

    async getDownloadedMaps() {
        // database / MapLibre
    }
}