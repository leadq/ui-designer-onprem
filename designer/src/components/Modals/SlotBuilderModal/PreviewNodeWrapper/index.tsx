import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'

import { StaticNodeRenderer } from '../StaticNodeRenderer'

export interface PreviewNodeWrapperProps {
  node: DesignNode
  selectedId: string | null
  onSelect: (id: string) => void
}

// Selection outline and click catcher
export const PreviewNodeWrapper = ({ node, selectedId, onSelect }: PreviewNodeWrapperProps) => {
  const isSelected = selectedId === node.id
  const meta = registry[node.type]

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    onSelect(node.id)
  }

  return (
    <div
      style={{
        position: 'relative',
        outline: isSelected
          ? '2px solid var(--primary)'
          : '1px dashed rgba(var(--primary-rgb), 0.25)',
        outlineOffset: isSelected ? '-2px' : '0px',
        padding: meta?.isContainer ? '8px' : '2px',
        margin: '4px 0',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'all 0.15s ease',
      }}
      onClick={handleClick}
    >
      <StaticNodeRenderer node={node} selectedId={selectedId} onSelect={onSelect} />
    </div>
  )
}
