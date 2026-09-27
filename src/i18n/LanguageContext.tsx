import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  LANGUAGE_STORAGE_KEY,
  languages,
  translations,
  type Direction,
  type Language,
  type TranslationKey,
} from "./translations";

type TranslationParams = Record<string, string | number>;

type LanguageContextValue = {
  language: Language;
  dir: Direction;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === "ar" || stored === "en" ? stored : "en";
};

const interpolate = (value: string, params?: TranslationParams) => {
  if (!params) return value;
  return Object.entries(params).reduce(
    (result, [key, paramValue]) => result.replaceAll(`{${key}}`, String(paramValue)),
    value
  );
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const dir = languages[language].dir;

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) => {
      const value = translations[language][key] || translations.en[key] || key;
      return interpolate(value, params);
    },
    [language]
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [dir, language]);

  const value = useMemo(
    () => ({ language, dir, setLanguage, t }),
    [dir, language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return value;
};

export type { Language, TranslationKey };
