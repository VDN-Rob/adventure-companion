import { DaysRepository } from "@/database/dayRepository";
import { TripsRepository } from "@/database/tripRepository";
import { Trip } from "@/models/Trip";


export class TripServices {
    constructor (
        private tripsRepository: TripsRepository,
        private daysRepository: DaysRepository
    ) {}

    async getTrip(tripId: string) {
        return await this.tripsRepository.getTripById(tripId);
    }
    
    async getTripDetails(tripId: string) {
        const trip = await this.tripsRepository.getTripById(tripId);
    
        if (!trip) {
          return null;
        }
    
        const days = await this.daysRepository.getAllDayForTrip(tripId);
    
        return {
          trip,
          days,
        };

    }

    async getAllTrips() {
        return await this.tripsRepository.getTrips();
    }

    async createTrip(trip: Trip) {
        await this.tripsRepository.createTrip(trip);
    }

    async updateTrip(updatedTrip: Trip) {
        await this.tripsRepository.updateTrip(updatedTrip);
    }

    async deleteTrip(tripId: string) {
        await this.tripsRepository.deleteTrip(tripId);
    }

    async calculateTripStatistics(tripId: string): Promise<TripStatistics> {
        const stats: TripStatistics = {
            totalDistance: 0,
            totalElevation: 0
        };

        const days = await this.daysRepository.getAllDayForTrip(tripId);

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
    
}

interface TripStatistics {
    totalDistance: number,
    totalElevation: number
}