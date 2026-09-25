/**
 * Represents an exchange rate between two currencies for a specific date.
 */
export interface ExchangeRate {
    id: string;

    date: string;
    
    baseCurrency: string;
    targetCurrency: string;
    
    rateDate: string;
    rate: number;
}