import { useMemo } from 'react'
import { getAdapter } from '@root/adapters'
import { Box, Text } from '@root/components/common'
import { getAdapterBackgroundColor } from '@root/utils/colorTokens/getAdapterBackgroundColor'
import { createNode } from '@root/utils/nodes'

import { NativePreview } from './NativePreview'

import styles from './styles.module.scss'

export interface PalettePreviewProps {
  type: string
  adapterId: string
  displayName: string
}

export const PalettePreview = ({ type, adapterId, displayName }: PalettePreviewProps) => {
  const adapter = getAdapter(adapterId)
  const node = useMemo(() => createNode(adapter.registry, type), [adapter, type])
  const backgroundColor = getAdapterBackgroundColor(adapter)
  const Provider = adapter.Provider
  const meta = adapter.registry[type]

  const size = meta.tableContents
    ? 'wide'
    : meta.isContainer || meta.collection
      ? 'medium'
      : 'compact'

  return (
    <Box
      className={[styles.palettePreview, styles[`palettePreview--${size}`]].join(' ')}
      data-palette-preview={type}
    >
      <Box className={styles.palettePreview__header}>
        <Text size='sm' weight={600}>
          {displayName}
        </Text>
      </Box>
      <Box
        ref={(element) => element?.setAttribute('inert', '')}
        aria-hidden
        className={styles.palettePreview__surface}
        style={{ backgroundColor }}
      >
        <Box data-designer-library className={styles.palettePreview__content}>
          <Provider>
            <NativePreview node={node} registry={adapter.registry} />
          </Provider>
        </Box>
      </Box>
    </Box>
  )
}
