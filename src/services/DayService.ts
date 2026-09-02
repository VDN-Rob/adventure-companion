import { DaysRepository } from "@/database/dayRepository";
import { Day } from "@/models/Day";
import { ServiceResult } from "@/types/serviceResult";
import { validateDayFields } from "@/utils/validation/dayValidation";

export class DayServices {
    constructor(
      private daysRepository: DaysRepository
    ) {}
  
    // Queries
    async getDayByDate(date: string) {
      return this.daysRepository.getDayByDate(date);
    }

    async getDay(dayId: string) {
      return this.daysRepository.getDayById(dayId);
    }
  
    async getDaysForTrip(tripId: string) {
      return this.daysRepository.getAllDayForTrip(tripId);
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

      await this.daysRepository.updateDay(updatedDay);

      return {
        success: true
      }
    }

    async deleteDay(dayId: string) {
      return this.daysRepository.deleteDay(dayId);
    }
  }