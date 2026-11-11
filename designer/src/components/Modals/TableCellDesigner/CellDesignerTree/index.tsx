import { Box, Button } from '@root/components/common'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'

import styles from './styles.module.scss'

export interface CellDesignerTreeProps {
  node: DesignNode
  selectedId: string
  onSelect: (id: string) => void
}

export const CellDesignerTree = ({ node, selectedId, onSelect }: CellDesignerTreeProps) => (
  <Box className={styles.cellDesignerTree}>
    <Button
      draggable
      aria-pressed={selectedId === node.id}
      data-cell-tree={node.id}
      size='sm'
      variant={selectedId === node.id ? 'light' : 'ghost'}
      onClick={() => onSelect(node.id)}
      onDragStart={(event) => {
        event.stopPropagation()

        event.dataTransfer.setData(
          'application/x-cell-designer',
          JSON.stringify({ movingId: node.id }),
        )
      }}
    >
      {node.label ?? registry[node.type]?.displayName ?? node.type}
    </Button>
    {node.children.concat(Object.values(node.slots ?? {}).flat()).map((child) => (
      <CellDesignerTree key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} />
    ))}
  </Box>
)
