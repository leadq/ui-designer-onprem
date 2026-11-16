import { type ReactElement, type ReactNode, useEffect, useState } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { type FloatingPosition, getFloatingPosition } from '../utils/getFloatingPosition'

import styles from './styles.module.scss'

export interface TooltipProps {
  children: ReactElement
  label: ReactNode
  accessibleLabel?: string
  delay?: number
  isDisabled?: boolean
  variant?: 'hint' | 'preview'
  position?: FloatingPosition
}

/** The trigger remains the real editor control; the visual hint lives outside canvas transforms. */
export const Tooltip = ({
  children,
  label,
  accessibleLabel,
  position = 'top',
  delay = 0,
  isDisabled = false,
  variant = 'hint',
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isDisabled) {
      setIsOpen(false)
    }
  }, [isDisabled])

  const handleOpenChange = setIsOpen

  return (
    <TooltipPrimitive.Provider disableHoverableContent delayDuration={delay}>
      <TooltipPrimitive.Root open={!isDisabled && isOpen} onOpenChange={handleOpenChange}>
        <TooltipPrimitive.Trigger
          asChild
          onFocus={(event) => {
            // Only keyboard focus reopens hints; pointer/programmatic focus must not.
            if (!event.currentTarget.matches(':focus-visible')) {
              event.preventDefault()
            }
          }}
        >
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            {...getFloatingPosition(position)}
            data-designer-chrome
            data-editor-tooltip
            aria-label={accessibleLabel}
            collisionPadding={8}
            sideOffset={5}
            className={[
              styles.tooltip,
              variant === 'preview' ? styles['tooltip--preview'] : '',
            ].join(' ')}
          >
            {label}
            <TooltipPrimitive.Arrow asChild>
              <span className={styles.tooltip__arrow} />
            </TooltipPrimitive.Arrow>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
