import { DiaryEntriesRepository } from "@/database/diaryEntryRepository";
import { DiaryEntry } from "@/models/DiaryEntry";
import * as Crypto from "expo-crypto";
import { DayServices } from "./DayService";

type CreateDiaryEntryInput = {
  tripId: string;
  date: string;

  title: string;
  text: string | null;

  photo1: string | null;
  photo2: string | null;
  photo3: string | null;
};

export class DiaryEntryServices {
    constructor(
      private diaryEntriesRepository: DiaryEntriesRepository,
      private dayServices: DayServices
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
    async createDiaryEntry(
      input: CreateDiaryEntryInput
    ) {
      let day =
        await this.dayServices.getDayByTripAndDate(
          input.tripId,
          input.date
        );
  
      if (!day) {
        day = {
          id: Crypto.randomUUID(),
          tripId: input.tripId,
          date: input.date,
          title: null,
          notes: null,
          plannedElevation: null,
          plannedDistance: null,
        };
  
        await this.dayServices.createDay(day);
      }
      

      const existingEntry =
        await this.diaryEntriesRepository.getDiaryEntryForDay(day.id);

      if (existingEntry) {
        throw new Error(
          "A diary entry already exists for this date."
        );
      }

      const now = new Date().toISOString();
  
      const entry: DiaryEntry = {
        id: Crypto.randomUUID(),
        dayId: day.id,
  
        title: input.title,
        text: input.text,
  
        photo1: input.photo1,
        photo2: input.photo2,
        photo3: input.photo3,
  
        createdAt: now,
        updatedAt: now,
      };
  
      await this.diaryEntriesRepository.createDiaryEntry(
        entry
      );
  
      return entry;
    }

    async updateDiaryEntry(updatedDiaryEntry: DiaryEntry) {
        await this.diaryEntriesRepository.updateDiaryEntry(updatedDiaryEntry)
    }

    async deleteDiaryEntry(diaryEntryId: string) {
      return this.diaryEntriesRepository.deleteDiaryEntry(diaryEntryId);
    }
  }