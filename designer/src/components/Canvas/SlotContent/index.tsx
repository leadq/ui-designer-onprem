import { Box } from '@root/components/common/Box'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignNode } from '@root/types/document'

import { DesignNodeWrapper } from '../DesignNodeWrapper'

import styles from './styles.module.scss'

export interface SlotContentProps {
  nodes: DesignNode[]
  slotKey: string
  parentId: string
  label: string
  selectionProxyId: string
  isPreviewMode: boolean
  hasCycle: boolean
}

export const SlotContent = ({
  nodes,
  slotKey,
  parentId,
  label,
  selectionProxyId,
  isPreviewMode,
  hasCycle,
}: SlotContentProps) => {
  const { translate } = useBuilderI18n()

  if (isPreviewMode && (hasCycle || nodes.length === 0)) {
    return null
  }

  return (
    <Box
      className={`${styles.slotContent} ${isPreviewMode ? '' : styles['slotContent--design']}`}
      data-parent-id={parentId}
      data-slot-cycle={hasCycle || undefined}
      data-slot-key={slotKey}
    >
      {!isPreviewMode && <Box className={styles.slotContent__label}>{label}</Box>}
      {hasCycle ? (
        <Box className={styles.slotContent__empty} role='alert'>
          {translate('canvas.cyclicSlot')}
        </Box>
      ) : nodes.length > 0 ? (
        <Box className={styles.slotContent__children}>
          {nodes.map((child) => (
            <DesignNodeWrapper
              key={`${child.id}:${isPreviewMode ? 'preview' : 'design'}`}
              node={child}
              selectionProxyId={selectionProxyId}
            />
          ))}
        </Box>
      ) : (
        <Box className={styles.slotContent__empty}>{translate('canvas.emptySlot')}</Box>
      )}
    </Box>
  )
}
