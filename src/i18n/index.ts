import { AppLanguage } from "@/config/appSetting";
import { en } from "./resources/en";

export type TranslationKeys = typeof en;

const resources: Partial<Record<AppLanguage, TranslationKeys>> = {
    en,
};

export function getTranslations(
    language: AppLanguage,
): TranslationKeys {
    return resources[language] ?? en;
}