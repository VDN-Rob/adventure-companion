export interface Day {
    id: string;
    tripId: string; // trip 1-N days
    date: string;
    title: string | null;
    notes: string | null;
    plannedElevation: number | null;
    plannedDistance: number | null;
}