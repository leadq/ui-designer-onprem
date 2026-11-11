import type { ReactNode } from 'react'

import { IconEditingContext, type IconEditingValue } from './context'

export interface IconEditingProviderProps extends IconEditingValue {
  children: ReactNode
}

export const IconEditingProvider = ({ children, ...value }: IconEditingProviderProps) => (
  <IconEditingContext.Provider value={value}>{children}</IconEditingContext.Provider>
)
