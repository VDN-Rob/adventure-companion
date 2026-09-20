export type ExpenseCategory =
  | "food"
  | "accommodation"
  | "transport"
  | "gear"
  | "activity"
  | "other";

export interface Expense {
  id: string;
  tripId: string | null;
  dayId: string | null;

  amount: number;
  currency: string; // Original currency

  category: ExpenseCategory;
  description: string | null;

  date: string;
}

export interface ExpenseWithConversion extends Expense {
  convertedAmount: number;
  convertedCurrency: string;
}