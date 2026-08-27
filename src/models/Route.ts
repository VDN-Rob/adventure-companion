export interface TrackPoint {
  latitude: number;
  longitude: number;
  elevation?: number;
  timestamp?: string;
}
  
export interface Route {
  id: string;
  dayId: string;
  name?: string;
  distanceMeters?: number;
  elevationGainMeters?: number;
  elevationLossMeters?: number;
  trackPointCount: number;
  importedAt: string;
  filePath: string;
}