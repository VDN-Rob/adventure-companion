import { Trip } from "@/models/Trip";

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).toUpperCase();
}

export function getTodayDate(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDayNumber(
  startDate: string,
  currentDate: string
): number {
  const start = new Date(`${startDate}T00:00:00`);
  const current = new Date(`${currentDate}T00:00:00`);

  const difference =
    current.getTime() - start.getTime();

  return Math.floor(
    difference / (1000 * 60 * 60 * 24)
  ) + 1;
}


export function getDateDaysAgo(
  date: string,
  days: number
): string {
  const result = new Date(
    `${date}T00:00:00Z`
  );

  result.setUTCDate(
    result.getUTCDate() - days
  );

  return result
    .toISOString()
    .slice(0, 10);
}

export function getTripDuration(
  trip: Trip
): number {
  const effectiveEnd =
    trip.endDate ??
    getTodayDate();

  return (
    getDayNumber(
      trip.startDate,
      effectiveEnd
    ) + 1
  );
}

export function getElapsedTripDays(
  trip: Trip
): number {
  const today = getTodayDate();

  if (today < trip.startDate) {
    return 0;
  }

  const effectiveEnd =
    trip.endDate !== null &&
    trip.endDate < today
      ? trip.endDate
      : today;

  return (
    getDayNumber(
      trip.startDate,
      effectiveEnd
    ) + 1
  );
}