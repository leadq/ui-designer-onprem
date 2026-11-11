import { type ReactNode, useMemo } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import type { FloatingPosition } from '../utils/getFloatingPosition'

import { MenuConfigurationContext } from './contexts/MenuConfigurationContext'
import { MenuCheckboxItem } from './MenuCheckboxItem'
import { MenuDivider } from './MenuDivider'
import { MenuDropdown } from './MenuDropdown'
import { MenuItem } from './MenuItem'
import { MenuLabel } from './MenuLabel'
import { MenuTarget } from './MenuTarget'

export interface MenuRootProps {
  children: ReactNode
  position?: FloatingPosition
  width?: number
  transition?: 'fade' | 'pop'
  isOpen?: boolean
  isInitiallyOpen?: boolean
  onChange?: (isOpen: boolean) => void
}

const MenuRoot = ({
  children,
  position = 'bottom',
  width,
  transition = 'fade',
  isOpen,
  isInitiallyOpen,
  onChange,
}: MenuRootProps) => {
  const configuration = useMemo(
    () => ({ position, width, transition }),
    [position, width, transition],
  )

  return (
    <MenuConfigurationContext.Provider value={configuration}>
      <DropdownMenu.Root
        defaultOpen={isInitiallyOpen}
        modal={false}
        open={isOpen}
        onOpenChange={onChange}
      >
        {children}
      </DropdownMenu.Root>
    </MenuConfigurationContext.Provider>
  )
}

export const Menu = Object.assign(MenuRoot, {
  Target: MenuTarget,
  Dropdown: MenuDropdown,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  Label: MenuLabel,
  Divider: MenuDivider,
})
