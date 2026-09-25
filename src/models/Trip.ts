/**
 * Represents a trip and its associated planning information.
 */
export interface Trip {
    id: string;

    name: string;
    description: string | null;

    startDate: string;
    endDate: string | null;
    
    budget: number | null;
    budgetCurrency: string;
}