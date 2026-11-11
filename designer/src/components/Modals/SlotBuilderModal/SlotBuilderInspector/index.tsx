import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { ComponentMeta } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { SlotNodeProps } from '../SlotNodeProps'
import { SlotNodeStyles } from '../SlotNodeStyles'

import styles from '../styles.module.scss'

const NODE_ID_PREVIEW_LENGTH = 8

export interface SlotBuilderInspectorProps {
  selectedNode: DesignNode | null
  selectedMeta: ComponentMeta | null | undefined
  onPropChange: (key: string, value: unknown) => void
  onStyleChange: (key: string, value: string) => void
}

export const SlotBuilderInspector = ({
  selectedNode,
  selectedMeta,
  onPropChange: handlePropChange,
  onStyleChange: handleStyleChange,
}: SlotBuilderInspectorProps) => {
  const { translate } = useBuilderI18n()

  return (
    <div className={styles.slotBuilderModal__editorPanel}>
      <div className={styles.slotBuilderModal__editorPanelTitle}>
        {translate('slotBuilder.inspector')}
      </div>
      {selectedNode && selectedMeta ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {selectedMeta.displayName}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              ID: {selectedNode.id.substring(0, NODE_ID_PREVIEW_LENGTH)}...
            </div>
          </div>

          {/* Props Schema Section */}
          <SlotNodeProps
            selectedMeta={selectedMeta}
            selectedNode={selectedNode}
            onChange={handlePropChange}
          />

          {/* Basic Styles Section */}
          <SlotNodeStyles selectedNode={selectedNode} onChange={handleStyleChange} />
        </div>
      ) : (
        <div className={styles.slotBuilderModal__noSelection}>
          {translate('slotBuilder.noSelection')}
        </div>
      )}
    </div>
  )
}
