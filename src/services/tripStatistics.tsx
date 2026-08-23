import { DaysRepository } from "@/database/dayRepository";

interface TripStatistics {
    totalDistance: number,
    totalElevation: number
}

export async function calculateTripStatistics(
            tripId: string,
            daysRepository: DaysRepository
        ): Promise<TripStatistics> {
            
    const stats: TripStatistics = {
        totalDistance: 0,
        totalElevation: 0
    };

    const days = await daysRepository.getAllDayForTrip(tripId);

    for (var day of days) {
        if (day.plannedDistance !== null) {
            stats.totalDistance += day.plannedDistance;
        }

        if (day.plannedElevation !== null) {
            stats.totalElevation += day.plannedElevation;
        }
    }

    return stats;
}