export type AppLanguage =
    | "en"
    | "fr"
    | "nl"

export type AppCurrency =
    | "EUR"
    | "USD"
    | "GBP"
    | "CHF";

export type AppTimeFormat =
    | "24"
    | "12"

export const appSettings = {
    language: "en",
    currency: "EUR",
    timeFormat: "24"
} satisfies {
    language: AppLanguage;
    currency: AppCurrency;
    timeFormat: string;
};