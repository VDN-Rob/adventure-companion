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
    
        let resolveDownload!: () => void;
        let rejectDownload!: (error: unknown) => void;
    
        const downloadFinished = new Promise<void>((resolve, reject) => {
            resolveDownload = resolve;
            rejectDownload = reject;
        });
    
        const offlinePack = await OfflineManager.createPack(
            {
                mapStyle: MAP_STYLE,
                minZoom,
                maxZoom,
                bounds,
                metadata: {
                    name,
                },
            },
    
            (pack, status) => {
                console.log("Download:", status);
    
                if (status.percentage >= 100) {
                    console.log("Download complete!");
                    resolveDownload();
                }
            },
    
            (pack, error) => {
                console.error("Map download error:", error);
                rejectDownload(error);
            }
        );
    
        // createPack() has now returned, so we have MapLibre's ID
        const offlineRegionId = offlinePack.id;
    
        // Wait for the actual download
        await downloadFinished;
    
        // Only now save it to SQLite
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
    
            creationDate: new Date().toISOString(),
        };
    
        await this.mapsRepository.createMap(map);
    
        return map;
    }

    async deleteRegion(map: OfflineMap) {
        await OfflineManager.deletePack(map.offlineRegionId);
    
        await this.mapsRepository.deleteMap(map.id);
    }

    async getDownloadedMaps(): Promise<OfflineMap[]> {
        const maps = await this.mapsRepository.getMaps();
    
        const downloadedMaps: OfflineMap[] = [];
    
        for (const map of maps) {
            try {
                const pack = await OfflineManager.getPack(
                    map.offlineRegionId
                );
    
                if (pack) {
                    downloadedMaps.push(map);
                }
            } catch (error) {
                console.error(
                    `Could not find offline pack ${map.offlineRegionId}`,
                    error
                );
            }
        }
    
        return downloadedMaps;
    }
}