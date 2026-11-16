import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { UIAdapter } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { HierarchyTree } from '../HierarchyTree'
import { PreviewNodeWrapper } from '../PreviewNodeWrapper'

import styles from '../styles.module.scss'

export interface SlotBuilderWorkspaceProps {
  localNodes: DesignNode[]
  selectedNodeId: string | null
  isMultiple: boolean
  AdapterProvider: UIAdapter['Provider']
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onMove: (id: string, direction: 'up' | 'down') => void
}

export const SlotBuilderWorkspace = ({
  localNodes,
  selectedNodeId,
  isMultiple,
  AdapterProvider,
  onSelect: handleSetSelectedNodeIdSelect,
  onDelete: handleDeleteNodeDelete,
  onMove: handleMoveNodeMove,
}: SlotBuilderWorkspaceProps) => {
  const { translate } = useBuilderI18n()

  return (
    <div data-editor-viewport className={styles.slotBuilderModal__workspace}>
      <div className={styles.slotBuilderModal__previewHeader}>
        <span>{translate('slotBuilder.preview')}</span>
        <span style={{ fontSize: '10px', color: 'var(--primary)' }}>
          {isMultiple
            ? translate('slotBuilder.multipleAllowed')
            : translate('slotBuilder.singleAllowed')}
        </span>
      </div>

      <div data-designer-library className={styles.slotBuilderModal__previewContainer}>
        <AdapterProvider>
          {localNodes.length > 0 ? (
            <div className={styles.slotBuilderModal__previewWrapper}>
              {localNodes.map((node) => (
                <PreviewNodeWrapper
                  key={node.id}
                  node={node}
                  selectedId={selectedNodeId}
                  onSelect={handleSetSelectedNodeIdSelect}
                />
              ))}
            </div>
          ) : (
            <div className={styles.slotBuilderModal__emptyPreview}>
              <span>{translate('slotBuilder.emptyCanvas')}</span>
              <span>{translate('slotBuilder.emptyCanvasHint')}</span>
            </div>
          )}
        </AdapterProvider>
      </div>

      <div className={styles.slotBuilderModal__previewHeader}>
        <span>{translate('slotBuilder.hierarchy')}</span>
      </div>
      <div className={styles.slotBuilderModal__treeContainer}>
        {localNodes.length > 0 ? (
          <HierarchyTree
            nodes={localNodes}
            selectedId={selectedNodeId}
            onDelete={handleDeleteNodeDelete}
            onMove={handleMoveNodeMove}
            onSelect={handleSetSelectedNodeIdSelect}
          />
        ) : (
          <div
            style={{
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              fontSize: '11px',
              padding: '8px',
            }}
          >
            {translate('slotBuilder.emptyHierarchy')}
          </div>
        )}
      </div>
    </div>
  )
}
