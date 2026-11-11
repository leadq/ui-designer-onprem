import { createContext, useContext } from 'react'

import type { FloatingPosition } from '../../utils/getFloatingPosition'

export interface MenuConfiguration {
  position: FloatingPosition
  width?: number
  transition: 'fade' | 'pop'
}

export const MenuConfigurationContext = createContext<MenuConfiguration>({
  position: 'bottom',
  transition: 'fade',
})

export const useMenuConfiguration = () => useContext(MenuConfigurationContext)
