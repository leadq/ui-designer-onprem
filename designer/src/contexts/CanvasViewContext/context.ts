import { createContext } from 'react'

export interface CanvasView {
  id: string
  width: number
}

export const CanvasViewContext = createContext<CanvasView | null>(null)
