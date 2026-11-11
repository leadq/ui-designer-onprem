import type { Registry } from '@root/types/componentContract'
import type { DesignNode, SlotComponent } from '@root/types/document'
import { getAllNodes } from '@root/utils/flows/flowModel'

/** Retain only reachable slot templates, with stable canonical IDs and transitive dependencies. */
export const getReferencedSavedDesigns = (
  nodes: DesignNode[],
  savedDesigns: SlotComponent[],
  registry: Registry,
): SlotComponent[] => {
  const included = new Set<string>()

  const visit = (items: DesignNode[], path: string[]) => {
    for (const node of getAllNodes(items)) {
      for (const schema of registry[node.type]?.propsSchema ?? []) {
        const id = node.props[schema.key]

        if (schema.type !== 'slot' || typeof id !== 'string' || !id) {
          continue
        }

        const saved = savedDesigns.find((item) => item.id === id)

        if (!saved || path.includes(id)) {
          throw new Error('INVALID_SAVED_CONTENT: missing or recursive slot template')
        }

        if (!included.has(id)) {
          visit(saved.nodes, [...path, id])

          included.add(id)
        }
      }
    }
  }

  visit(nodes, [])

  return savedDesigns.filter((item) => included.has(item.id))
}
