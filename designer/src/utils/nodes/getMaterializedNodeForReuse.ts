import type { Registry } from '@root/types/componentContract'
import type { DesignNode, SlotComponent } from '@root/types/document'
import { getClonedNodesForReuse } from '@root/utils/nodes/getClonedNodesForReuse'

export const getMaterializedNodeForReuse = (
  cell: DesignNode,
  registry: Registry,
  savedDesigns: SlotComponent[],
): DesignNode => {
  const getMaterialized = (node: DesignNode, path: string[]): DesignNode => {
    const result: DesignNode = {
      ...node,
      props: { ...node.props },
      children: node.children.map((child) => getMaterialized(child, path)),
      slots: Object.fromEntries(
        Object.entries(node.slots ?? {}).map(([key, children]) => [
          key,
          children.map((child) => getMaterialized(child, path)),
        ]),
      ),
    }

    for (const schema of registry[node.type]?.propsSchema ?? []) {
      if (schema.type !== 'slot' || typeof node.props[schema.key] !== 'string') {
        continue
      }

      const saved = savedDesigns.find((design) => design.id === node.props[schema.key])

      if (!saved) {
        continue
      }

      if (path.includes(saved.id)) {
        throw new Error('Recursive saved content cannot be copied.')
      }

      result.slots![schema.key] = getClonedNodesForReuse(saved.nodes).map((child) =>
        getMaterialized(child, [...path, saved.id]),
      )

      result.props[schema.key] = null
    }

    return result
  }

  return getMaterialized(cell, [])
}
