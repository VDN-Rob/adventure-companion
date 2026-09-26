import { Expense, ExpenseCategory } from "@/models/Expense";
import { SQLiteDatabase } from "expo-sqlite";

type ExpenseRow = {
    id: string;
    trip_id: string | null;
    day_id: string | null;

    amount: number;
    currency: string;

    category: ExpenseCategory;

    description: string | null;
    date: string;
};

export type ExpenseFilter = {
    tripId?: string;
    startDate?: string;
    endDate?: string;
};

/**
 * Provides SQLite persistence operations for expenses.
 *
 * Expenses intentionally remain independent of the lifecycle of their
 * associated trip or day. Deleting a trip or day therefore does not delete
 * its historical expenses.
 */
export class ExpensesRepository {
    constructor(private db: SQLiteDatabase) {}


    /**
     * Returns expenses matching the supplied optional filters.
     */
    async getExpenses(filter: ExpenseFilter): Promise<Expense[]> {
        let query = `
            SELECT *
            FROM expenses
            WHERE 1 = 1
        `;
        
        const params: string[] = [];
        
        if (filter.tripId !== undefined) {
            query += " AND trip_id = ?";
            params.push(filter.tripId);
        }
        
        if (filter.startDate !== undefined) {
            query += " AND date >= ?";
            params.push(filter.startDate);
        }
        
        if (filter.endDate !== undefined) {
            query += " AND date <= ?";
            params.push(filter.endDate);
        }
        
        query += " ORDER BY date ASC";
        
        const rows = await this.db.getAllAsync<ExpenseRow>(
            query,
            ...params
        );
        
        return rows.map((row) => this.mapRowToExpense(row));
    }


    /**
     * Returns all expenses associated with a trip.
     */
    async getAllExpensesForTrip(tripId: string): Promise<Expense[]> {
        const rows = await this.db.getAllAsync<ExpenseRow>(
            "SELECT * FROM expenses WHERE trip_id = ? ORDER BY date DESC",
            tripId
        );
        
        return rows.map((row) => this.mapRowToExpense(row));
    }


    /**
     * Returns all expenses associated with a day.
     */
    async getAllExpensesForDay(dayId: string): Promise<Expense[]> {
        const rows = await this.db.getAllAsync<ExpenseRow>(
            "SELECT * FROM expenses WHERE day_id = ? ORDER BY date DESC",
            dayId
        );
        
        return rows.map((row) => this.mapRowToExpense(row));
    }


    /**
     * Returns an expense by its ID.
     */
    async getExpenseById(id: string): Promise<Expense | null> {
        const row = await this.db.getFirstAsync<ExpenseRow>(
            "SELECT * FROM expenses WHERE id = ?",
            id
        );

        return row ? this.mapRowToExpense(row) : null;
    }


    /**
     * Maps a SQLite row to the domain Expense model.
     */
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


    /**
     * Persists a new expense.
     */
    async createExpense(expense: Expense) {
        return this.db.runAsync(
            `
                INSERT INTO expenses (
                    id,
                    trip_id,
                    day_id,
                    amount,
                    currency,
                    category,
                    description,
                    date
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
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


    /**
     * Updates an existing expense.
     */
    async updateExpense(expense: Expense) {
        return this.db.runAsync(
            `
                UPDATE expenses
                SET trip_id = ?,
                    day_id = ?,
                    amount = ?,
                    currency = ?,
                    category = ?,
                    description = ?,
                    date = ?
                WHERE id = ?
            `,
            expense.tripId,
            expense.dayId,
            expense.amount,
            expense.currency,

            expense.category,
            expense.description,

            expense.date,

            expense.id
        );
    }


    /**
     * Deletes an expense by ID.
     */
    async deleteExpense(id: string) {
        return this.db.runAsync(
            "DELETE FROM expenses WHERE id = ?",
            id
        );
    }

}