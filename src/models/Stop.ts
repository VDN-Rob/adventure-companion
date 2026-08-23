export interface Stop {
    id: string;
    dayId: string;
    name: string;
    type: StopType;
    latitude: number | null;
    longitude: number | null;
    notes: string | null;
}

export type StopType =
  | "food"
  | "water"
  | "supermarket"
  | "accommodation"
  | "other";