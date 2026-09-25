/**
 * Represents a single day within a trip.
 */
export interface Day {
    id: string;
    tripId: string;

    date: string;
    
    title: string | null;
    notes: string | null;
    
    plannedElevation: number | null;
    plannedDistance: number | null;
}