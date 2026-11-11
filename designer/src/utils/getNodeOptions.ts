import { registry } from '../registry'
import type { DesignNode } from '../types/document'

export interface NodeOption {
  value: string
  label: string
}

export const getNodeOptions = (nodes: DesignNode[], parentLabels: string[] = []): NodeOption[] =>
  nodes.flatMap((node) => {
    const fieldLabel = typeof node.props.label === 'string' ? node.props.label : ''
    const nodeLabel = node.label || fieldLabel || registry[node.type]?.displayName || node.type
    const path = [...parentLabels, nodeLabel]

    return [
      { value: node.id, label: path.join(' / ') },
      ...getNodeOptions(node.children, path),
      ...Object.values(node.slots ?? {}).flatMap((slotNodes) => getNodeOptions(slotNodes, path)),
    ]
  })
