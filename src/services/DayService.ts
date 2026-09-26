import { DaysRepository } from "@/database/dataAccessLayer/dayRepository";
import { TripsRepository } from "@/database/dataAccessLayer/tripRepository";
import { Day } from "@/models/Day";
import { ServiceResult } from "@/types/serviceResult";
import { validateDayFields } from "@/utils/validation/dayValidation";

export class DayServices {
  constructor(
    private daysRepository: DaysRepository,
    private tripsRepository: TripsRepository
  ) {}

  // Queries
  async getDayByTripAndDate(tripId: string, date: string) {
    return this.daysRepository.getDayByTripAndDate(tripId, date);
  }

  async getDay(dayId: string) {
    return this.daysRepository.getDayById(dayId);
  }

  async getDaysForTrip(tripId: string) {
    return this.daysRepository.getAllDaysForTrip(tripId);
  }

  // Scripts
  async createDay(day: Day): Promise<ServiceResult> {
    const errors = validateDayFields({
      title: day.title ?? "",
      date: day.date,
      plannedElevation: day.plannedElevation === null ? "" : String(day.plannedElevation),
      plannedDistance: day.plannedDistance === null ? "" : String(day.plannedDistance)
    });
    
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        errors,
      };
    }

    // Check date range
    const dateResult = await this.checkDateOverlap(day);

    if (!dateResult.success) {
      return dateResult;
    }

    // Check duplicates
    const duplicate = await this.daysRepository.hasDayOnDate(
      day.tripId,
      day.date
    );
  
    if (duplicate) {
      return {
        success: false,
        errors: {
          date: "There is already a planned day for this date.",
        },
      };
    }

    await this.daysRepository.createDay(day);

    return {
      success: true
    }
  }

  async updateDay(updatedDay: Day): Promise<ServiceResult> {
    const errors = validateDayFields({
      title: updatedDay.title ?? "",
      date: updatedDay.date,
      plannedElevation: updatedDay.plannedElevation === null ? "" : String(updatedDay.plannedElevation),
      plannedDistance: updatedDay.plannedDistance === null ? "" : String(updatedDay.plannedDistance)
    });
    
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        errors,
      };
    }

    // Check for date overlap
    const dateErrors = this.checkDateOverlap(updatedDay);

    if (Object.keys(dateErrors).length > 0) {
      return {
        success: false,
        errors,
      };
    }

    const duplicate = await this.daysRepository.hasDayOnDate(
      updatedDay.tripId,
      updatedDay.date,
      updatedDay.id
    );
  
    if (duplicate) {
      return {
        success: false,
        errors: {
          date: "There is already a planned day for this date.",
        },
      };
    }

    await this.daysRepository.updateDay(updatedDay);

    return {
      success: true
    }
  }

  async deleteDay(dayId: string) {
    return this.daysRepository.deleteDay(dayId);
  }

  // Helper functions
  async checkDateOverlap(day: Day): Promise<ServiceResult> {
    // Check that there is no duplicate date
    const existingDay = await this.daysRepository.getDayByTripAndDate(day.tripId, day.date);
    
    if (existingDay && existingDay.id !== day.id) {
      return {
        success: false,
        errors: {
          date: "There is already a day planned for this date.",
        },
      };
    }

    // Check that day falls in range of trip dates
    const trip = await this.tripsRepository.getTripById(day.tripId);

    if (!trip) {
      return {
        success: false,
        errors: {
          trip: "There is no trip linked to this day."
        }
      }
    }

    if (day.date < trip.startDate) {
      return {
        success: false,
        errors: {
          date: "The day falls before the start of the trip."
        }
      }
    }


    if (trip.endDate &&  trip.endDate < day.date) {
      return {
        success: false,
        errors: {
          date: "The day falls after the end of the trip."
        }
      }
    }

    return {
      success: true
    }
  }
}