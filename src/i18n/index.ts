import { AppLanguage } from "@/config/appSetting";
import { en } from "./resources/en";
import { fr } from "./resources/fr";
import { nl } from "./resources/nl";

export type TranslationKeys = typeof en;

const resources: Partial<Record<AppLanguage, TranslationKeys>> = {
    en,
    fr,
    nl
};

export function getTranslations(language: AppLanguage): TranslationKeys {
    return resources[language] ?? en;
}