export type ExpenseCategory =
  | "food"
  | "accommodation"
  | "transport"
  | "gear"
  | "activity"
  | "other";

export interface Expense {
  id: string;
  tripId: string;
  dayId: string | null;

  amount: number;
  currency: string;

  category: ExpenseCategory;
  description: string | null;

  date: string;
}