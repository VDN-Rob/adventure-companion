/**
 * Represents a point of interest associated with a trip day.
 */
export interface POI {
  id: string;
  dayId: string;

  name: string;
  type: POIType;
  
  latitude: number | null;
  longitude: number | null;
  
  notes: string | null;
  
  visitedAt: string | null;
}


/**
 * Categories used to classify points of interest.
 */
export type POIType =
  | "food"
  | "water"
  | "supermarket"
  | "accommodation"
  | "other";