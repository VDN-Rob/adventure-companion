import { DiaryEntriesRepository } from "@/database/dataAccessLayer/diaryEntryRepository";
import { DiaryEntry } from "@/models/DiaryEntry";
import * as Crypto from "expo-crypto";
import { DayService } from "./DayService";

type CreateDiaryEntryInput = {
	tripId: string;
	date: string;

	title: string;
	text: string | null;

	photo1: string | null;
	photo2: string | null;
	photo3: string | null;
};

export class DiaryEntryService {
	constructor(
		private readonly diaryEntryRepository: DiaryEntriesRepository,
		private readonly dayService: DayService
	) {}

	async getDiaryEntriesForTrip(tripId: string): Promise<DiaryEntry[]> {
		return this.diaryEntryRepository.getDiaryEntriesForTrip(tripId);
	}
	async getDiaryEntryForDay(dayId: string): Promise<DiaryEntry | null> {
		return this.diaryEntryRepository.getDiaryEntryForDay(dayId);
	}

	async getDiaryEntryById(id: string): Promise<DiaryEntry | null> {
		return this.diaryEntryRepository.getDiaryEntryById(id);
	}

	async createDiaryEntry(input: CreateDiaryEntryInput): Promise<DiaryEntry> {
		let day = await this.dayService.getDayByTripAndDate(input.tripId, input.date);

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

			const result = await this.dayService.createDay(day);

			if (!result.success) {
				throw new Error(Object.values(result.errors).join(" "));
			}
		}
		

		const existingEntry = await this.diaryEntryRepository.getDiaryEntryForDay(day.id);

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

		await this.diaryEntryRepository.createDiaryEntry(
		entry
		);

		return entry;
	}

	async updateDiaryEntry(updatedDiaryEntry: DiaryEntry) {
		await this.diaryEntryRepository.updateDiaryEntry(updatedDiaryEntry)
	}

	async deleteDiaryEntry(diaryEntryId: string) {
		return this.diaryEntryRepository.deleteDiaryEntry(diaryEntryId);
	}
}