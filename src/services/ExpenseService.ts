import { ExpensesRepository } from "@/database/dataAccessLayer/expenseRepository";
import { Expense } from "@/models/Expense";
import { ExchangeRateService } from "./ExchangeRateService";

export type ExpenseStatistics = {
    total: number;
    byCategory: Record<string, number>;
    byDate: Record<string, number>;
    conversionPendingCount: number;
};

export type ExpenseFilter = {
    tripId?: string;
    startDate?: string;
    endDate?: string;
};

/**
 * retrieve expenses
 * ask ExchangeRateService to convert them
 * calculate totals/categories/daily spending
 */
export class ExpenseServices {
    constructor(
        private readonly expenseRepository: ExpensesRepository,
        private readonly exchangeRateService: ExchangeRateService
    ) {}
  
    // Queries
    async getExpenseById(id: string) {
        return this.expenseRepository.getExpenseById(id);
    }

    async getExpensesForDay(dayId: string) {
      return this.expenseRepository.getAllExpensesForDay(dayId);
    }
  
    async getExpensesForTrip(tripId: string) {
      return this.expenseRepository.getAllExpensesForTrip(tripId);
    }
    
    async getExpenses(
        filter: ExpenseFilter
      ): Promise<Expense[]> {
        return this.expenseRepository.getExpenses(filter);
      }
  
    // Scripts
    async createExpense(newExpense: Expense) {
        await this.expenseRepository.createExpense(newExpense);
    }

    async updateExpense(updatedExpense: Expense) {
        await this.expenseRepository.updateExpense(updatedExpense)
    }

    async deleteExpense(id: string) {
      return this.expenseRepository.deleteExpense(id);
    }

    async getTripStatistics(
        tripId: string,
        targetCurrency: string
    ): Promise<ExpenseStatistics> {
        const expenses =
            await this.expenseRepository.getAllExpensesForTrip(tripId);
    
        return this.calculateStatistics(
            expenses,
            targetCurrency
        );
    }
    
    async getDayStatistics(
        dayId: string,
        targetCurrency: string
    ): Promise<ExpenseStatistics> {
        const expenses =
            await this.expenseRepository.getAllExpensesForDay(dayId);
    
        return this.calculateStatistics(
            expenses,
            targetCurrency
        );
    }
    
    async getExpenseStatistics(
        filter: ExpenseFilter,
        targetCurrency: string
    ): Promise<ExpenseStatistics> {
        const expenses =
            await this.expenseRepository.getExpenses(filter);
    
        return this.calculateStatistics(
            expenses,
            targetCurrency
        );
    }

    private async calculateStatistics(
        expenses: Expense[],
        targetCurrency: string
    ): Promise<ExpenseStatistics> {
        const statistics: ExpenseStatistics = {
            total: 0,
            byCategory: {},
            byDate: {},
            conversionPendingCount: 0,
        };
    
        const currency = targetCurrency.toUpperCase();
    
        for (const expense of expenses) {
            const convertedAmount =
                await this.exchangeRateService.convert(
                    expense.amount,
                    expense.currency,
                    currency,
                    expense.date
                );
    
            if (convertedAmount === null) {
                statistics.conversionPendingCount += 1;
                continue;
            }
    
            statistics.total += convertedAmount;
    
            statistics.byCategory[expense.category] =
                (statistics.byCategory[expense.category] ?? 0) +
                convertedAmount;
    
            statistics.byDate[expense.date] =
                (statistics.byDate[expense.date] ?? 0) +
                convertedAmount;
        }
    
        return statistics;
    }
  }