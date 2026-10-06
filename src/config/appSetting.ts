export type AppLanguage =
    | "en"
    | "fr"
    | "nl";

export type AppCurrency =
    | "EUR"
    | "USD"
    | "GBP"
    | "CHF";

export type AppTimeFormat =
    | "24"
    | "12";

export interface AppSettings {
    language: AppLanguage;
    currency: AppCurrency;
    timeFormat: AppTimeFormat;
}

export const defaultAppSettings: AppSettings = {
    language: "en",
    currency: "EUR",
    timeFormat: "24",
};