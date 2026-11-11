import { createContext } from 'react'
import trTranslations from '@root/i18n/tr.json'

export type BuilderLanguage = 'tr' | 'en'

export type BuilderTranslationKey = keyof typeof trTranslations

export type BuilderTranslationValues = Record<string, string | number>

export interface BuilderI18nContextValue {
  language: BuilderLanguage
  setLanguage: (language: BuilderLanguage) => void
  translate: (key: BuilderTranslationKey, values?: BuilderTranslationValues) => string
}

export const BuilderI18nContext = createContext<BuilderI18nContextValue | null>(null)
