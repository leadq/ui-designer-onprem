import { type ReactNode, useRef } from 'react'
import * as Popover from '@radix-ui/react-popover'

import { usePopoverPlacement } from './hooks/usePopoverPlacement'

import styles from './styles.module.scss'

export interface AnchoredPopoverProps {
  anchor: HTMLElement
  label: string
  children: ReactNode
  onClose: () => void
}

/** Portal leaves canvas scaling and stays inside an owning editor dialog's focus boundary. */
export const AnchoredPopover = ({ anchor, label, children, onClose }: AnchoredPopoverProps) => {
  const contentRef = useRef<HTMLDivElement>(null)

  const virtualRef = useRef({
    contextElement: anchor,
    getBoundingClientRect: () => anchor.getBoundingClientRect(),
  })

  const { boundary, side } = usePopoverPlacement(anchor, contentRef, onClose)

  virtualRef.current.contextElement = anchor

  virtualRef.current.getBoundingClientRect = () => anchor.getBoundingClientRect()

  return (
    <Popover.Root
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose()
        }
      }}
    >
      <Popover.Anchor virtualRef={virtualRef} />
      <Popover.Portal container={anchor.closest<HTMLElement>('[role="dialog"]') ?? document.body}>
        <Popover.Content
          ref={contentRef}
          data-canvas-control
          hideWhenDetached
          align='center'
          aria-label={label}
          className={styles.anchoredPopover}
          collisionBoundary={boundary ?? undefined}
          collisionPadding={12}
          side={side}
          sideOffset={8}
          sticky='always'
          updatePositionStrategy='always'
          onClick={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
          onEscapeKeyDown={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onCloseAutoFocus={(event) => {
            event.preventDefault()

            if (
              document.activeElement === document.body ||
              contentRef.current?.contains(document.activeElement)
            ) {
              anchor.focus({ preventScroll: true })
            }
          }}
          onPointerDownOutside={(event) => {
            const pointer = event.detail.originalEvent

            if (
              boundary?.contains(pointer.target as Node) &&
              (pointer.button === 1 || boundary.dataset.grab === 'true')
            ) {
              event.preventDefault()
            }
          }}
        >
          <div className={styles.anchoredPopover__content}>{children}</div>
          <Popover.Arrow data-popover-arrow className={styles.anchoredPopover__arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
