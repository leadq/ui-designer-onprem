import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'

const COMPONENT_ICONS: Record<string, string> = {
  button: '🔘',
  typography: '✏️',
  textInput: '📝',
  select: '📋',
  checkbox: '☑️',
  card: '🃏',
  box: '📦',
  grid: '🏁',
  list: '📋',
} as const

// Recursive component to render a simple hierarchy view inside right panel
export const SimpleHierarchyPreview = ({
  nodes,
  depth = 0,
}: {
  nodes: DesignNode[]
  depth?: number
}) => {
  if (!nodes || nodes.length === 0) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        marginLeft: depth > 0 ? '12px' : '0',
        borderLeft: depth > 0 ? '1px dashed var(--designer-border-color)' : 'none',
        paddingLeft: depth > 0 ? '8px' : '0',
      }}
    >
      {nodes.map((node) => {
        const meta = registry[node.type]
        const icon = COMPONENT_ICONS[node.type] ?? '📦'

        return (
          <div key={node.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '10px',
                color: 'var(--designer-text-secondary)',
              }}
            >
              <span style={{ fontSize: '11px' }}>{icon}</span>
              <span>{node.label ?? meta?.displayName ?? node.type}</span>
            </div>
            {node.children && node.children.length > 0 ? (
              <SimpleHierarchyPreview depth={depth + 1} nodes={node.children} />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
