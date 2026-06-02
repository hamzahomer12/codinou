"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { en, type TranslationKey } from "@/lib/translations/en"
import { fr } from "@/lib/translations/fr"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = { en, fr }

const defaultContextValue: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: (key: string) => en[key as TranslationKey] || key,
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase()
    setLanguage(browserLang.startsWith("fr") ? "fr" : "en")
  }, [])

  useEffect(() => {
    document.documentElement.lang = language === "fr" ? "fr" : "en"
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as TranslationKey] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
