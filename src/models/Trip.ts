export interface Trip {
    id: string;
    name: string;
    startDate: string;
    endDate: string | null;
    description: string | null;
    
    budget: number | null;
    budgetCurrency: string;
}