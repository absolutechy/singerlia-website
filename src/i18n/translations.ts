import en from "./locales/en";
import ar from "./locales/ar";

export type Language = "en" | "ar";
export type Direction = "ltr" | "rtl";

export const LANGUAGE_STORAGE_KEY = "singerlia_language";

export const languages: Record<Language, { label: string; nativeLabel: string; dir: Direction }> = {
  en: { label: "English", nativeLabel: "English", dir: "ltr" },
  ar: { label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
};

export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  ar,
} as const satisfies Record<Language, Record<TranslationKey, string>>;
