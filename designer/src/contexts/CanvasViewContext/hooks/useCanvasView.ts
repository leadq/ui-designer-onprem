import { useContext } from 'react'

import { CanvasViewContext } from '../context'

export const useCanvasView = () => useContext(CanvasViewContext)
