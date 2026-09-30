/**
 * Represents a locally available offline map region.
 */
export interface OfflineMap {
    id: string;
    offlineRegionId: string;

    minZoom: number;
    maxZoom: number;

    west: number;
    south: number;
    east: number;
    north: number;
    
    creationDate: string;
}