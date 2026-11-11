import { type JSXElementConstructor, useEffect, useState } from 'react'
import { Inline } from '@root/components/common/Inline'
import type { IconGlyphProps } from '@root/types/iconLibrary'
import { getIconEntry } from '@root/utils/designIcons/getIconEntry'

import styles from './styles.module.scss'

export interface IconGraphicProps {
  value: string
  size: number
}

const ICON_CACHE = new Map<string, Promise<JSXElementConstructor<IconGlyphProps>>>()

export const IconGraphic = ({ value, size }: IconGraphicProps) => {
  const [loaded, setLoaded] = useState<{
    key: string
    Component?: JSXElementConstructor<IconGlyphProps>
    hasError?: boolean
  }>()

  const entry = getIconEntry(value)

  useEffect(() => {
    let isCurrent = true

    if (!entry) {
      return
    }

    const pending = ICON_CACHE.get(value) ?? entry.library.load(entry.id)

    ICON_CACHE.set(value, pending)

    pending
      .then((Component) => {
        if (isCurrent) {
          setLoaded({ key: value, Component })
        }
      })
      .catch(() => {
        ICON_CACHE.delete(value)

        if (isCurrent) {
          setLoaded({ key: value, hasError: true })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [value, entry])

  const Component = loaded?.key === value ? loaded.Component : undefined

  return (
    <Inline
      aria-hidden
      className={styles.iconGraphic}
      data-icon-loaded={Component ? value : undefined}
    >
      {Component ? (
        <Component size={size} />
      ) : (
        <Inline aria-hidden className={styles.iconGraphic__placeholder} />
      )}
    </Inline>
  )
}
