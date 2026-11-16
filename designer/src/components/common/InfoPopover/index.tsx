import { type ReactNode, useRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { EditorIcon } from '@root/components/common/EditorIcon'

import { Button } from '../Button'
import { Stack } from '../Layout'
import { Text } from '../Text'

import { useOutsidePointerDismiss } from './hooks/useOutsidePointerDismiss'

import styles from './styles.module.scss'

export interface InfoPopoverProps {
  label: string
  icon?: 'info' | 'help' | 'keyboard' | 'mouse'
  triggerLabel?: string
  isTitleVisible?: boolean
  children: ReactNode
}

/** Non-modal help preserves focus and consumes Escape before its owning editor dialog. */
export const InfoPopover = ({
  label,
  children,
  icon = 'info',
  triggerLabel,
  isTitleVisible = true,
}: InfoPopoverProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)
  const handleOpenChange = setIsOpen

  useOutsidePointerDismiss(isOpen, triggerRef, contentRef, handleClose)

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <Button
          ref={triggerRef}
          aria-label={label}
          size='sm'
          type='button'
          variant='ghost'
          className={[styles.infoPopover, triggerLabel ? styles['infoPopover--labeled'] : ''].join(
            ' ',
          )}
        >
          <EditorIcon aria-hidden='true' name={icon} size={18} strokeWidth={1.7} />
          {triggerLabel}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          ref={contentRef}
          data-designer-chrome
          align='start'
          aria-label={label}
          className={styles.infoPopover__content}
          collisionPadding={16}
          side='right'
          sideOffset={11.5}
          onEscapeKeyDown={(event) => event.stopPropagation()}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => {
            const activeElement = document.activeElement

            event.preventDefault()

            if (activeElement === document.body || contentRef.current?.contains(activeElement)) {
              triggerRef.current?.focus({ preventScroll: true })
            }
          }}
        >
          <Stack gap='xs'>
            {isTitleVisible ? (
              <Text size='sm' weight={600}>
                {label}
              </Text>
            ) : null}
            {children}
          </Stack>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
