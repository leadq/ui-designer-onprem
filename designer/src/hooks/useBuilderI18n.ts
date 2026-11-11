import { useContext } from 'react'

import { BuilderI18nContext } from '../contexts/BuilderI18nContext/context'

export const useBuilderI18n = () => {
  const context = useContext(BuilderI18nContext)

  if (!context) {
    throw new Error('useBuilderI18n must be used within BuilderI18nProvider')
  }

  return context
}
