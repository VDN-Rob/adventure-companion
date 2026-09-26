import { DaysRepository } from "@/database/dataAccessLayer/dayRepository";
import { TripsRepository } from "@/database/dataAccessLayer/tripRepository";
import { Trip } from "@/models/Trip";
import { ServiceResult } from "@/types/serviceResult";
import { getTodayDate } from "@/utils/date";
import { validateTripFields } from "@/utils/validation/tripValidation";


export class TripServices {
    constructor (
        private tripsRepository: TripsRepository,
        private daysRepository: DaysRepository
    ) {}

    // Queries
    async getFutureTrips(date: string) {
        return this.tripsRepository.getFutureTrips(date);
    }
    
    async getPastTrips(date: string) {
        return this.tripsRepository.getPastTrips(date);
    }
    
    async getTripsForDate(date: string): Promise<Trip[]> {
        return this.tripsRepository.getTripsForDate(date);
    }

    async getActiveTrips(): Promise<Trip[]> {
      return this.tripsRepository.getTripsForDate(getTodayDate())
    }

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

    // Scripts
    async createTrip(trip: Trip): Promise<ServiceResult> {
        const errors = validateTripFields({
          name: trip.name,
          startDate: trip.startDate,
          endDate: trip.endDate ?? "",
          budget: trip.budget === null ? "" : String(trip.budget),
          budgetCurrency: trip.budgetCurrency,
        });
      
        if (Object.keys(errors).length > 0) {
          return {
            success: false,
            errors,
          };
        }
      
        await this.tripsRepository.createTrip(trip);
      
        return {
          success: true,
        };
    }

    async updateTrip(updatedTrip: Trip): Promise<ServiceResult> {
        const errors = validateTripFields({
          name: updatedTrip.name,
          startDate: updatedTrip.startDate,
          endDate: updatedTrip.endDate ?? "",
          budget: updatedTrip.budget === null ? "" : String(updatedTrip.budget),
          budgetCurrency: updatedTrip.budgetCurrency,
        });
      
        if (Object.keys(errors).length > 0) {
          return {
            success: false,
            errors,
          };
        }

        const daysOutsideTrip =
        await this.daysRepository.getDaysOutsideTrip(
          updatedTrip.id,
          updatedTrip.startDate,
          updatedTrip.endDate
        );

      if (daysOutsideTrip.length > 0) {
        return {
          success: false,
          errors: {
            startDate:
              "The new adventure dates would leave planned days outside the adventure.",
            endDate:
              "The new adventure dates would leave planned days outside the adventure.",
          },
        };
      }
      
        await this.tripsRepository.updateTrip(updatedTrip);
      
        return {
          success: true,
        };
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