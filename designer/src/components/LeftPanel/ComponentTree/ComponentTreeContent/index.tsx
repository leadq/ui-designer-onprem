import { DragEvent, useRef } from 'react'
import { Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import { getWorkspaceNodes } from '@root/utils/frames/frameWorkspace'

import { useTreeDnd } from '../hooks/useTreeDnd'
import { TreeNode } from '../TreeNode'

import styles from '../styles.module.scss'

export const ComponentTreeContent = () => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const { handleClearDropIndicator, handleRowDrop } = useTreeDnd()
  const treeRef = useRef<HTMLDivElement>(null)

  const handleDragLeave = (event: DragEvent) => {
    // If the cursor leaves the entire tree container, clear the indicator.
    if (treeRef.current && !treeRef.current.contains(event.relatedTarget as Node)) {
      handleClearDropIndicator()
    }
  }

  const handleDragOver = (event: DragEvent) => {
    if (event.dataTransfer.types.includes('application/tree-node-id')) {
      event.preventDefault()
    }
  }

  if (nodes.length === 0) {
    return (
      <Text className={styles.componentTree__empty} color='muted' size='sm'>
        {translate('tree.empty')}
      </Text>
    )
  }

  return (
    <div
      ref={treeRef}
      style={{ width: '100%' }}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleRowDrop}
    >
      <Stack gap={2} style={{ position: 'relative' }}>
        {getWorkspaceNodes(nodes).map((node) => (
          <TreeNode key={node.id} depth={0} node={node} />
        ))}
      </Stack>
    </div>
  )
}
