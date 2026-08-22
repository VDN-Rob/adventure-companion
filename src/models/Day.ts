export interface Day {
    id: string;
    tripId: string; // trip 1-N days
    date: string;
    title?: string;
    notes?: string;
    plannedElevation?: number;
    plannedDistance?: number;
}