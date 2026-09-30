import { MAP_STYLE } from "@/constants/map";
import { OfflineMapsRepository } from "@/database/dataAccessLayer/mapsRepository";
import { OfflineMap } from "@/models/OfflineMap";
import { MapBounds } from "@/utils/map/combineMapBounds";
import { subtractBounds } from "@/utils/map/mapCoverage";
import { OfflineManager } from "@maplibre/maplibre-react-native";
import * as Crypto from "expo-crypto";

export class MapService {
    constructor (
        private readonly mapsRepository: OfflineMapsRepository
    ) {}

    // Queries
    getDownloadProgress() {}
    
    getDownloadedRegions() {
        return this.mapsRepository.getMaps();
    }

    // Scripts
    async downloadRegion(name: string, bounds: MapBounds, minZoom = 8, maxZoom = 15): Promise<OfflineMap> {
    
        const id = Crypto.randomUUID();

        let offlinePack: Awaited<ReturnType<typeof OfflineManager.createPack>> | null = null;
    
        try {
            let resolveDownload!: () => void;
            let rejectDownload!: (error: unknown) => void;
    
            const downloadFinished = new Promise<void>((resolve, reject) => {
                resolveDownload = resolve;
                rejectDownload = reject;
            });
    
            offlinePack = await OfflineManager.createPack(
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
    
            const offlineRegionId = offlinePack.id;
    
            await downloadFinished;
    
            const map: OfflineMap = {
                id,
                offlineRegionId,
    
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
        } catch (error) {
            if (offlinePack) {
                try {
                    await OfflineManager.deletePack(offlinePack.id);
                } catch (cleanupError) {
                    console.error(
                        "Failed to clean up offline pack after download failure:",
                        cleanupError
                    );
                }
            }
    
            throw error;
        }
    }

    async downloadRequiredRegions(
        regions: {
            name: string;
            bounds: MapBounds;
        }[],
        minZoom = 8,
        maxZoom = 15
    ): Promise<OfflineMap[]> {
        const existingMaps = await this.mapsRepository.getMaps();
    
        const downloadedMaps: OfflineMap[] = [];
    
        for (const region of regions) {
            let remainingRegions: MapBounds[] = [
                region.bounds,
            ];
    
            for (const existingMap of existingMaps) {
                // We currently use one common zoom range for offline maps.
                // Therefore an existing map can contribute coverage when
                // its zoom range completely covers the requested range.
                if (
                    existingMap.minZoom > minZoom ||
                    existingMap.maxZoom < maxZoom
                ) {
                    continue;
                }
    
                const existingBounds: MapBounds = [
                    existingMap.west,
                    existingMap.south,
                    existingMap.east,
                    existingMap.north,
                ];
    
                remainingRegions = remainingRegions.flatMap(
                    bounds =>
                        subtractBounds(
                            bounds,
                            existingBounds
                        )
                );
    
                if (remainingRegions.length === 0) {
                    break;
                }
            }
    
            for (const bounds of remainingRegions) {
                const map = await this.downloadRegion(
                    region.name,
                    bounds,
                    minZoom,
                    maxZoom
                );
    
                downloadedMaps.push(map);
    
                // Make the newly-created map part of the coverage
                // used for subsequent regions in this same operation.
                existingMaps.push(map);
            }
        }
    
        return downloadedMaps;
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