import { type ReactNode, useEffect, useMemo, useState } from 'react'
import enTranslations from '@root/i18n/en.json'
import trTranslations from '@root/i18n/tr.json'

import {
  BuilderI18nContext,
  type BuilderLanguage,
  type BuilderTranslationKey,
  type BuilderTranslationValues,
} from './context'

const STORAGE_KEY = 'ui-builder-language'

const TRANSLATIONS: Record<BuilderLanguage, Record<BuilderTranslationKey, string>> = {
  tr: trTranslations,
  en: enTranslations,
}

export interface BuilderI18nProviderProps {
  children: ReactNode
}

export const BuilderI18nProvider = ({ children }: BuilderI18nProviderProps) => {
  const savedLanguage = localStorage.getItem(STORAGE_KEY)
  const initialLanguage: BuilderLanguage = savedLanguage === 'en' ? 'en' : 'tr'
  const [language, setLanguage] = useState<BuilderLanguage>(initialLanguage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)

    document.documentElement.lang = language
  }, [language])

  const context = useMemo(() => {
    const translate = (key: BuilderTranslationKey, values: BuilderTranslationValues = {}) =>
      Object.entries(values).reduce(
        (translation, [name, value]) => translation.replaceAll(`{${name}}`, String(value)),
        TRANSLATIONS[language][key],
      )

    return { language, setLanguage, translate }
  }, [language])

  return <BuilderI18nContext.Provider value={context}>{children}</BuilderI18nContext.Provider>
}
