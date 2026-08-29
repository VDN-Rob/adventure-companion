import { DiaryEntriesRepository } from "@/database/diaryEntryRepository";
import { DiaryEntry } from "@/models/DiaryEntry";

export class DiaryEntryServices {
    constructor(
      private diaryEntriesRepository: DiaryEntriesRepository
    ) {}
  
    // Queries
    async getDiaryEntryForDay(dayId: string) {
      return this.diaryEntriesRepository.getDiaryEntryForDay(dayId);
    }
  
    async getDiaryEntry(id: string) {
      return this.diaryEntriesRepository.getDiaryEntryById(id);
    }
  
    // Scripts
    async createDiaryEndry(entry: DiaryEntry) {
        await this.diaryEntriesRepository.createDiaryEntry(entry);
    }

    async updateDay(updatedDiaryEntry: DiaryEntry) {
        await this.diaryEntriesRepository.updateDiaryEntry(updatedDiaryEntry)
    }

    async deleteDay(diaryEntryId: string) {
      return this.diaryEntriesRepository.deleteDiaryEntry(diaryEntryId);
    }
  }