import { Expense, ExpenseCategory } from "@/models/Expense";
import { SQLiteDatabase } from "expo-sqlite";

type ExpenseRow = {
    id: string;
    trip_id: string;
    day_id: string | null;
    amount: number;
    currency: string;
    category: ExpenseCategory;
    description: string | null;
    date: string;
  };

export class ExpensesRepository {
    constructor(private db: SQLiteDatabase) {}

    async getAllExpensesForTrip(tripId: string) {
        const rows = await this.db.getAllAsync<ExpenseRow>(
            "SELECT * FROM expenses WHERE trip_id = ? ORDER BY date DESC",
            tripId
        );
        
        return rows.map(row => this.mapRowToExpense(row));
    }

    async getAllExpensesForDay(dayId: string) {
        const rows = await this.db.getAllAsync<ExpenseRow>(
            "SELECT * FROM expenses WHERE day_id = ? ORDER BY date DESC",
            dayId
        );
        
        return rows.map(row => this.mapRowToExpense(row));
    }

    async getExpenseById(id: string) {
        const row = await this.db.getFirstAsync<ExpenseRow>(
            "SELECT * FROM expenses WHERE id = ?",
            id
        );

        if (!row) return null;

        return this.mapRowToExpense(row);
    }

    // Small helper function to map database to react
    private mapRowToExpense(row: ExpenseRow): Expense {
        return {
            id: row.id,
            tripId: row.trip_id,
            dayId: row.day_id,
            
            amount: row.amount,
            currency: row.currency,
            
            category: row.category,
            description: row.description,
            
            date: row.date,
        };
    }

    async createExpense(expense: Expense) {
        return this.db.runAsync(
            `INSERT INTO expenses (id, trip_id, day_id, amount, currency, category, description, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            expense.id,
            expense.tripId,
            expense.dayId,

            expense.amount,
            expense.currency,

            expense.category,
            expense.description,

            expense.date
        );
    }

    async updateExpense(expense: Expense) {
        return this.db.runAsync(
            `UPDATE expenses
            SET amount = ?, currency = ?, category = ?, description = ?, date = ?
            WHERE id = ?`,
            expense.amount,
            expense.currency,

            expense.category,
            expense.description,

            expense.date,

            expense.id
        );
    }

    async deleteExpense(id: string) {
        return this.db.runAsync(
            "DELETE FROM expenses WHERE id = ?",
            id
        );
    }
    
}