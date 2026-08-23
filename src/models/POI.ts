export interface POI {
    id: string;
    dayId: string;
    name: string;
    type: POIType;
    latitude: number | null;
    longitude: number | null;
    notes: string | null;
}

export type POIType =
  | "food"
  | "water"
  | "supermarket"
  | "accommodation"
  | "other";