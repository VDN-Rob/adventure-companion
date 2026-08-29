import { DiaryEntriesRepository } from "@/database/diaryEntryRepository";
import { DiaryEntry } from "@/models/DiaryEntry";

export class DiaryEntryServices {
    constructor(
      private diaryEntriesRepository: DiaryEntriesRepository
    ) {}
  
    // Queries
    async getDiaryEntriesForTrip(tripId: string) {
      return this.diaryEntriesRepository.getDiaryEntriesForTrip(tripId);
    }
    async getDiaryEntryForDay(dayId: string) {
      return this.diaryEntriesRepository.getDiaryEntryForDay(dayId);
    }
  
    async getDiaryEntry(id: string) {
      return this.diaryEntriesRepository.getDiaryEntryById(id);
    }
  
    // Scripts
    async createDiaryEntry(entry: DiaryEntry) {
        await this.diaryEntriesRepository.createDiaryEntry(entry);
    }

    async updateDiaryEntry(updatedDiaryEntry: DiaryEntry) {
        await this.diaryEntriesRepository.updateDiaryEntry(updatedDiaryEntry)
    }

    async deleteDiaryEntry(diaryEntryId: string) {
      return this.diaryEntriesRepository.deleteDiaryEntry(diaryEntryId);
    }
  }