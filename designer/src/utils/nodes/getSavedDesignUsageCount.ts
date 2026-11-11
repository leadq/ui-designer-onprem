import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

export const getSavedDesignUsageCount = (
  nodes: DesignNode[],
  designId: string,
  registry: Registry,
): number => {
  let count = 0

  const visit = (items: DesignNode[]): void => {
    for (const item of items) {
      const slotKeys =
        registry[item.type]?.propsSchema
          .filter((schema) => schema.type === 'slot')
          .map((schema) => schema.key) ?? []

      count += slotKeys.filter((key) => item.props[key] === designId).length

      visit(item.children)

      Object.values(item.slots ?? {}).forEach(visit)
    }
  }

  visit(nodes)

  return count
}
