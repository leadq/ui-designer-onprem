import { type ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useStableId } from '@root/hooks/useStableId'

import { ButtonBase } from '../ButtonBase'
import { Heading } from '../Text'

import { useModalFocusTrap } from './hooks/useModalFocusTrap'

import styles from './styles.module.scss'

interface ModalProps {
  isOpen: boolean
  hasBackdrop?: boolean
  isKeptMounted?: boolean
  contentSurface?: 'editor' | 'canvas'
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  isEscapeCloseEnabled?: boolean
  isOutsideClickCloseEnabled?: boolean
}

const Modal = ({
  isOpen: opened,
  hasBackdrop: withBackdrop = true,
  isKeptMounted: keepMounted = false,
  contentSurface = 'editor',
  onClose,
  title,
  children,
  size = 'md',
  isEscapeCloseEnabled: closeOnEscape = true,
  isOutsideClickCloseEnabled: closeOnClickOutside = true,
}: ModalProps) => {
  const { translate } = useBuilderI18n()
  const [mounted, setMounted] = useState(false)
  const titleId = useStableId()

  const modalRef = useModalFocusTrap({
    isOpen: opened,
    isReady: mounted,
    isEscapeCloseEnabled: closeOnEscape,
    onClose,
  })

  useEffect(() => {
    setMounted(true)

    return () => setMounted(false)
  }, [])

  if (!mounted || (!opened && !keepMounted)) {
    return null
  }

  return createPortal(
    <div
      className={[
        styles.overlay,
        contentSurface === 'canvas' ? styles['overlay--canvas'] : '',
        opened ? styles['overlay--opened'] : styles['overlay--hidden'],
        !withBackdrop ? styles['overlay--clear'] : '',
      ].join(' ')}
      onClick={closeOnClickOutside ? onClose : undefined}
    >
      <div
        ref={modalRef}
        aria-labelledby={title ? titleId : undefined}
        aria-modal='true'
        className={[styles.modal, styles[`modal--size-${size}`], styles['modal--opened']].join(' ')}
        role='dialog'
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <div className={styles.modal__header}>
            <Heading className={styles.modal__title} id={titleId} order={2}>
              {title}
            </Heading>
            <ButtonBase
              aria-label={translate('general.close')}
              className={styles.modal__close}
              onClick={onClose}
            >
              &times;
            </ButtonBase>
          </div>
        ) : null}
        <div
          className={[
            styles.modal__body,
            contentSurface === 'canvas' ? styles['modal__body--canvas'] : '',
          ].join(' ')}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export { Modal }

export type { ModalProps }
