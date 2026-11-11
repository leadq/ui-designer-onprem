import type { ReactNode } from 'react'

import { SlotRenderContext } from './context'

export interface SlotRenderProviderProps {
  path: string[]
  children: ReactNode
}

export const SlotRenderProvider = ({ path, children }: SlotRenderProviderProps) => (
  <SlotRenderContext.Provider value={path}>{children}</SlotRenderContext.Provider>
)
