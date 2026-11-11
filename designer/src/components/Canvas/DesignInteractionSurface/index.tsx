import { type ReactNode, useLayoutEffect, useRef } from 'react'
import { Box } from '@root/components/common'
import { handleDesignPointerDown } from '@root/utils/canvas/drag/handleDesignPointerDown'

import styles from './styles.module.scss'

export interface DesignInteractionSurfaceProps {
  children: ReactNode
}

/** Native inert blocks library events, focus and pseudo states; the editor owns input. */
export const DesignInteractionSurface = ({ children }: DesignInteractionSurfaceProps) => {
  const content = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = content.current

    if (!element) {
      return
    }

    element.inert = true

    return () => {
      element.inert = false
    }
  }, [])

  return (
    <Box
      data-design-interaction-surface
      className={styles.designInteractionSurface}
      onPointerDown={handleDesignPointerDown}
    >
      <Box ref={content} data-design-inert className={styles.designInteractionSurface__content}>
        {children}
      </Box>
    </Box>
  )
}
