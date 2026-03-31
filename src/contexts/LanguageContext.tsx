import React, { createContext, useContext, useState, useCallback } from "react";
import { en } from "@/i18n/en";
import { hi } from "@/i18n/hi";
import { mr } from "@/i18n/mr";

type Language = "en" | "hi" | "mr";
type Translations = typeof en;

const translations: Record<Language, Translations> = { en, hi, mr };
const languageNames: Record<Language, string> = { en: "English", hi: "हिंदी", mr: "मराठी" };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  languageNames: Record<Language, string>;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageNames, languages: ["en", "hi", "mr"] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
