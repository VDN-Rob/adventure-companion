import { ExpensesRepository } from "@/database/expenseRepository";
import { Expense } from "@/models/Expense";

export class ExpenseServices {
    constructor(
      private expenseRepository: ExpensesRepository
    ) {}
  
    // Queries
    async getExpense(id: string) {
        return this.expenseRepository.getExpenseById(id);
    }

    async getExpensesForDay(dayId: string) {
      return this.expenseRepository.getAllExpensesForDay(dayId);
    }
  
    async getExpensesForTrip(tripId: string) {
      return this.expenseRepository.getAllExpensesForTrip(tripId);
    }
  
    // Scripts
    async createExpense(newExpense: Expense) {
        await this.expenseRepository.createExpense(newExpense);
    }

    async updateExpense(updatedDay: Expense) {
        await this.expenseRepository.updateExpense(updatedDay)
    }

    async deleteExpense(id: string) {
      return this.expenseRepository.deleteExpense(id);
    }

    async getTripStatistics(tripId: string) {
        const expenses =
            await this.expenseRepository.getAllExpensesForTrip(tripId);
    
        const total = expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
        );
    
        const byCategory = expenses.reduce<Record<string, number>>(
            (result, expense) => {
                result[expense.category] =
                    (result[expense.category] ?? 0) + expense.amount;
    
                return result;
            },
            {}
        );
    
        return {
            total,
            byCategory,
        };
    }
  }