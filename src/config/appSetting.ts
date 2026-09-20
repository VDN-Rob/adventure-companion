export type AppLanguage =
    | "en"
    | "fr"
    | "nl"

export type AppCurrency =
    | "EUR"
    | "USD"
    | "GBP"
    | "CHF";

export const appSettings = {
    language: "en",
    currency: "EUR",
} satisfies {
    language: AppLanguage;
    currency: AppCurrency;
};