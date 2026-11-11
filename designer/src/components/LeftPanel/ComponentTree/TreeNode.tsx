import { ButtonBase, Group } from '@root/components/common'
import { Collapse } from '@root/components/common/Collapse'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import { getCollectionItemLabel } from '@root/utils/collectionAuthoring/getCollectionItemLabel'

import { useTreeDnd } from './hooks/useTreeDnd'
import { useTreeNode } from './hooks/useTreeNode'
import { TreeContextMenu } from './TreeContextMenu'
import { TreeNodeIdentity } from './TreeNodeIdentity'

import styles from './TreeNode.module.scss'

const TREE_DEPTH_INDENT_PX = 16
const TREE_BASE_INDENT_PX = 8
const EMPTY_TOGGLE_OPACITY = 0.3

export interface TreeNodeProps {
  node: DesignNode
  depth: number
}

export const TreeNode = ({ node, depth }: TreeNodeProps) => {
  const meta = registry[node.type]
  const isContainerNode = meta?.isContainer ?? false
  const hasChildren = node.children && node.children.length > 0

  const displayName =
    node.label || getCollectionItemLabel(node, registry) || meta?.displayName || node.type

  const {
    isSelected,
    isPreviewMode,
    isExpanded,
    isEditing,
    editValue,
    setEditValue,
    contextMenu,
    inputRef,
    handleSelect,
    handleContextMenu,
    handleDoubleClick,
    handleLabelSave,
    handleLabelKeyDown,
    handleToggleExpand,
    handleCloseContextMenu,
  } = useTreeNode(node.id, displayName)

  const {
    draggingId,
    dropIndicator,
    handleRowDragStart,
    handleRowDragOver,
    handleRowDrop,
    handleClearDropIndicator,
    handleRowDragEnd,
  } = useTreeDnd()

  const isDragging = draggingId === node.id
  const isOverThis = dropIndicator?.targetId === node.id
  const dropPosition = isOverThis ? dropIndicator?.position : null

  const handleDragStart = (event: React.DragEvent) => {
    if (isPreviewMode) {
      event.preventDefault()

      return
    }

    handleRowDragStart(node.id, event)
  }

  const handleDragOver = (event: React.DragEvent) => {
    handleRowDragOver(node.id, isContainerNode, event)
  }

  const nodeClasses = [
    styles.treeNode,
    isSelected ? styles['treeNode--selected'] : '',
    isDragging ? styles['treeNode--dragging'] : '',
    dropPosition === 'inside' ? styles['treeNode--dropInside'] : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleClearDropIndicatorDragLeave = handleClearDropIndicator
  const handleSelectClick = handleSelect
  const handleToggleExpandClick = handleToggleExpand
  const handleSetEditValueEditValueChange = setEditValue
  const handleCloseContextMenuClose = handleCloseContextMenu

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {dropPosition === 'before' && <div className={styles.treeNode__dropIndicatorBefore} />}
      {dropPosition === 'after' && <div className={styles.treeNode__dropIndicatorAfter} />}

      <ButtonBase
        className={nodeClasses}
        data-tree-node-id={node.id}
        draggable={!isPreviewMode}
        style={{
          paddingLeft: `${depth * TREE_DEPTH_INDENT_PX + TREE_BASE_INDENT_PX}px`,
        }}
        onClick={handleSelectClick}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        onDragEnd={handleRowDragEnd}
        onDragLeave={handleClearDropIndicatorDragLeave}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDrop={handleRowDrop}
      >
        <Group gap={6} isWrapping={false}>
          {/* Grip handle */}
          <div className={styles.treeNode__grip}>⠿</div>

          {/* Chevron for Container Nodes — always visible for containers */}
          <div
            style={{ width: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isContainerNode ? (
              <span
                style={{ opacity: hasChildren ? 1 : EMPTY_TOGGLE_OPACITY }}
                className={[
                  styles.chevron,
                  isExpanded ? styles['chevron--expanded'] : '',
                  !hasChildren ? styles['chevron--dimmed'] : '',
                ].join(' ')}
                onClick={handleToggleExpandClick}
              >
                ▸
              </span>
            ) : null}
          </div>

          <TreeNodeIdentity
            displayName={displayName}
            editValue={editValue}
            inputRef={inputRef}
            isEditing={isEditing}
            node={node}
            onEditValueChange={handleSetEditValueEditValueChange}
            onKeyDown={handleLabelKeyDown}
            onSave={handleLabelSave}
          />
        </Group>
      </ButtonBase>

      {hasChildren ? (
        <Collapse isOpen={isExpanded}>
          {node.children.map((child) => (
            <TreeNode key={child.id} depth={depth + 1} node={child} />
          ))}
        </Collapse>
      ) : null}

      {contextMenu ? (
        <TreeContextMenu
          nodeId={node.id}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenuClose}
        />
      ) : null}
    </div>
  )
}
