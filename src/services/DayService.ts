import { DaysRepository } from "@/database/dataAccessLayer/dayRepository";
import { TripsRepository } from "@/database/dataAccessLayer/tripRepository";
import { Day } from "@/models/Day";
import { ServiceResult } from "@/types/serviceResult";
import { validateDayFields } from "@/utils/validation/dayValidation";

export class DayService {
	constructor(
		private readonly daysRepository: DaysRepository,
		private readonly tripsRepository: TripsRepository
	) {}

	async getDayByTripAndDate(tripId: string, date: string): Promise<Day | null> {
		return this.daysRepository.getDayByTripAndDate(tripId, date);
	}

	async getDayById(dayId: string): Promise<Day | null> {
		return this.daysRepository.getDayById(dayId);
	}

	async getDaysForTrip(tripId: string): Promise<Day[]> {
		return this.daysRepository.getAllDaysForTrip(tripId);
	}

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
		const duplicate = await this.daysRepository.hasDayOnDate(day.tripId, day.date);
	
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
		const dateResult = await this.checkDateOverlap(updatedDay);

		if (Object.keys(dateResult).length > 0) {
			return {
				success: false,
				errors,
			};
		}

		const duplicate = await this.daysRepository.hasDayOnDate(updatedDay.tripId, updatedDay.date, updatedDay.id);
	
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

	/**
	 * Validates that a day belongs to an existing trip and falls within
	 * the trip's configured date range.
	 */
	private async checkDateOverlap(day: Day): Promise<ServiceResult> {
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