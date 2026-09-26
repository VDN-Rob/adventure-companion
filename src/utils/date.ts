import { Trip } from "@/models/Trip";

/**
 * Formats an ISO date string for display.
 *
 * Invalid dates are returned unchanged so callers do not lose the original
 * value when formatting fails.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date
    .toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}


/**
 * Returns today's date in YYYY-MM-DD format using the local timezone.
 */
export function getTodayDate(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/**
 * Returns the one-based day number for a date within a trip.
 *
 * For example, if startDate and currentDate are the same date, the result
 * is 1.
 */
export function getDayNumber(startDate: string, currentDate: string): number {
  const start = new Date(`${startDate}T00:00:00`);
  const current = new Date(`${currentDate}T00:00:00`);

  const difference = current.getTime() - start.getTime();

  return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
}


/**
 * Returns a date in YYYY-MM-DD format after subtracting the specified number
 * of days.
 */
export function getDateDaysAgo(date: string, days: number): string {
  const result = new Date(`${date}T00:00:00Z`);

  result.setUTCDate(result.getUTCDate() - days);

  return result.toISOString().slice(0, 10);
}


/**
 * Returns the total number of days in a trip.
 *
 * Open-ended trips use today's date as their effective end date.
 */
export function getTripDuration(trip: Trip): number {
  const effectiveEnd = trip.endDate ?? getTodayDate();

  return getDayNumber(trip.startDate, effectiveEnd);
}


/**
 * Returns the number of trip days that have elapsed up to today.
 *
 * Future trips return 0, while completed trips stop counting at their
 * configured end date.
 */
export function getElapsedTripDays(trip: Trip): number {
  const today = getTodayDate();

  if (today < trip.startDate) {
    return 0;
  }

  const effectiveEnd =
    trip.endDate !== null && trip.endDate < today
      ? trip.endDate
      : today;

  return getDayNumber(trip.startDate, effectiveEnd);
}