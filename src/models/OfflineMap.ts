export interface OfflineMap {
    id: string;
    offlineRegionId: string;
    name: string | null;
    minZoom: number;
    maxZoom: number;
    west: number;
    south: number;
    east: number;
    north: number;
    creationDate: string;
}