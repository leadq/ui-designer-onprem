import { useContext } from 'react'

import { SlotRenderContext } from '../context'

export const useSlotRenderPath = () => useContext(SlotRenderContext)
