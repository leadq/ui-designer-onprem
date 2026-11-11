import type { ReactElement } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export interface MenuTargetProps {
  children: ReactElement<{ isDisabled?: boolean; isLoading?: boolean; disabled?: boolean }>
}

export const MenuTarget = ({ children }: MenuTargetProps) => {
  const isDisabled =
    children.props.isDisabled || children.props.isLoading || children.props.disabled

  return (
    <DropdownMenu.Trigger asChild disabled={isDisabled}>
      {children}
    </DropdownMenu.Trigger>
  )
}
