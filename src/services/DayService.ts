import { DaysRepository } from "@/database/dayRepository";
import { Day } from "@/models/Day";

export class DayServices {
    constructor(
      private daysRepository: DaysRepository
    ) {}
  
    async getDay(dayId: string) {
      return this.daysRepository.getDayById(dayId);
    }
  
    async getDaysForTrip(tripId: string) {
      return this.daysRepository.getAllDayForTrip(tripId);
    }
  
    async createDay(day: Day) {
        await this.daysRepository.createDay(day);
    }

    async updateDay(updatedDay: Day) {
        await this.daysRepository.updateDay(updatedDay)
    }

    async deleteDay(dayId: string) {
      return this.daysRepository.deleteDay(dayId);
    }
  }