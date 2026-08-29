import { DaysRepository } from "@/database/dayRepository";
import { Day } from "@/models/Day";

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