/**
 * Formats an amount using the given currency.
 *
 * @param amount - The amount to format.
 * @param currency - The currency code (for example, "EUR" or "USD").
 * @returns The formatted currency string.
 */
export function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
    }).format(amount);
}

/**
 * Calculates the planned daily budget for a trip.
 *
 * @param budget - The total budget for the trip.
 * @param tripDays - The total number of planned trip days.
 * @returns The daily budget, or null if tripDays is zero or negative.
 */
export function calculateDailyBudget(budget: number, tripDays: number): number | null {
    if (tripDays <= 0) {
        return null;
    }

    return budget / tripDays;
}

/**
 * Calculates the average daily spending for a trip.
 *
 * @param totalSpent - The total amount spent so far.
 * @param elapsedDays - The number of elapsed trip days.
 * @returns The average daily spending, or null if elapsedDays is zero or negative.
 */
export function calculateDailySpending(totalSpent: number, elapsedDays: number): number | null {
    if (elapsedDays <= 0) {
        return null;
    }

    return totalSpent / elapsedDays;
}

/**
 * Calculates the amount remaining from a trip budget.
 *
 * @param budget - The total budget for the trip.
 * @param spent - The amount spent so far.
 * @returns The remaining budget. A negative value means the budget has been exceeded.
 */
export function calculateRemainingBudget(budget: number, spent: number): number {
    return budget - spent;
}