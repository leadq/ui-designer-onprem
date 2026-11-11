import { ButtonBase } from '@root/components/common/ButtonBase'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'

import { COMPONENT_ICONS } from '../constants/componentIcons'

import styles from '../styles.module.scss'

// Interactive tree list component
interface HierarchyTreeProps {
  nodes: DesignNode[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onMove: (id: string, direction: 'up' | 'down') => void
}

export const HierarchyTree = ({
  nodes,
  selectedId,
  onSelect,
  onDelete,
  onMove,
}: HierarchyTreeProps) => {
  if (nodes.length === 0) {
    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {nodes.map((node, index) => {
        const isSelected = selectedId === node.id
        const meta = registry[node.type]
        const hasChildren = node.children && node.children.length > 0

        return (
          <div key={node.id} className={styles.slotBuilderModal__treeNode}>
            <div
              className={[
                styles.slotBuilderModal__treeNodeContent,
                isSelected ? styles['slotBuilderModal__treeNodeContent--selected'] : '',
              ].join(' ')}
              onClick={() => onSelect(node.id)}
            >
              <div className={styles.slotBuilderModal__treeNodeLabel}>
                <span className={styles.slotBuilderModal__treeNodeIcon}>
                  {COMPONENT_ICONS[node.type] ?? '📦'}
                </span>
                <span>{node.label ?? meta?.displayName ?? node.type}</span>
              </div>
              <div className={styles.slotBuilderModal__treeNodeActions}>
                <ButtonBase
                  className={styles.slotBuilderModal__treeNodeActionBtn}
                  isDisabled={index === 0}
                  type='button'
                  onClick={(event) => {
                    event.stopPropagation()

                    onMove(node.id, 'up')
                  }}
                >
                  ↑
                </ButtonBase>
                <ButtonBase
                  className={styles.slotBuilderModal__treeNodeActionBtn}
                  isDisabled={index === nodes.length - 1}
                  type='button'
                  onClick={(event) => {
                    event.stopPropagation()

                    onMove(node.id, 'down')
                  }}
                >
                  ↓
                </ButtonBase>
                <ButtonBase
                  type='button'
                  className={[
                    styles.slotBuilderModal__treeNodeActionBtn,
                    styles['slotBuilderModal__treeNodeActionBtn--delete'],
                  ].join(' ')}
                  onClick={(event) => {
                    event.stopPropagation()

                    onDelete(node.id)
                  }}
                >
                  ✕
                </ButtonBase>
              </div>
            </div>
            {hasChildren ? (
              <HierarchyTree
                nodes={node.children}
                selectedId={selectedId}
                onDelete={onDelete}
                onMove={onMove}
                onSelect={onSelect}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
