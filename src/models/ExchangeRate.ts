export interface ExchangeRate {
    id: string;
    date: string;
    baseCurrency: string;
    targetCurrency: string;
    rateDate: string;
    rate: number;
}