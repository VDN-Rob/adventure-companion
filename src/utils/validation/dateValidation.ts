/**
 * Determines whether a value is a valid ISO date or date-time.
 */
export function isValidDateString(value: string): boolean {
	const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

	if (dateOnlyMatch) {
		const [, year, month, day] = dateOnlyMatch.map(Number);
		const date = new Date(year, month - 1, day);

		return (
			date.getFullYear() === year &&
			date.getMonth() === month - 1 &&
			date.getDate() === day
		);
	}

	// ISO 8601 date-time
	const date = new Date(value);

	return !Number.isNaN(date.getTime());
}