/**
 * Categories available for trip expenses.
 */
export type ExpenseCategory =
  | "food"
  | "accommodation"
  | "transport"
  | "gear"
  | "activity"
  | "other";


/**
 * Represents an expense associated with a trip or a specific day.
 */
export interface Expense {
  id: string;
  tripId: string | null;
  dayId: string | null;

  amount: number;
  currency: string;

  category: ExpenseCategory;
  description: string | null;

  date: string;
}

/**
 * Represents an expense after conversion to the requested currency.
 */
export interface ExpenseWithConversion extends Expense {
  convertedAmount: number;
  convertedCurrency: string;
}