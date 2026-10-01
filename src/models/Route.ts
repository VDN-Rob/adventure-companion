/**
 * Represents a single geographic point along a route.
 */
export interface TrackPoint {
  latitude: number;
  longitude: number;

  elevation?: number;

  timestamp?: string;
}
  

/**
 * Represents a recorded or imported route associated with a trip day.
 */
export interface Route {
  id: string;
  dayId: string;

  name?: string;
  
  distanceMeters?: number;
  elevationGainMeters?: number;
  elevationLossMeters?: number;
  
  trackPoints: TrackPoint[];
  
  importedAt: string;
  filePath: string;
}