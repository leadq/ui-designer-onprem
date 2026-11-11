import type { ComponentMeta } from '@root/types/componentContract'
import type { DesignNode, SlotComponent } from '@root/types/document'
import { getPropsAtWidth } from '@root/utils/responsive/getPropsAtWidth'
import { getSlotRenderMode } from '@root/utils/slotRendering'

import { getItemBinding } from './getItemBinding'
import { getSlotComponentIdentifier } from './getSlotComponentIdentifier'

export const getNativeExportProps = (
  node: DesignNode,
  meta: ComponentMeta | undefined,
  slotComponents: SlotComponent[],
  usedSlotComponents?: Set<string>,
) => {
  // Resolve named slots
  const slotSchemas = meta?.propsSchema?.filter((schema) => schema.type === 'slot') ?? []
  const processedSlots = new Set<string>()

  // Build props string — skip children key and values identical to defaults
  const propsEntries = Object.entries(
    node.responsiveProps ? getPropsAtWidth(node, null, meta) : node.props,
  )
    .filter(([key]) => {
      if (key === 'children') {
        return false
      }

      return true
    })
    .map(([key, value]) => {
      // If it is a slot prop, check if a global slot component is bound to it
      const slotSchema = slotSchemas.find((schema) => schema.key === key)

      if (slotSchema && value && typeof value === 'string') {
        const component = slotComponents.find((child) => child.id === value)

        if (component) {
          processedSlots.add(key)

          if (usedSlotComponents) {
            usedSlotComponents.add(value)
          }

          const cleanName = getSlotComponentIdentifier(component)
          const argumentNames = slotSchema.slotArgumentNames
          const parameters = argumentNames?.map((_, index) => `arg${index}`).join(', ') ?? 'item'

          const itemExpression = argumentNames
            ? `{ ${argumentNames.map((name, index) => `${JSON.stringify(name)}: arg${index}`).join(', ')} }`
            : 'item'

          return getSlotRenderMode(slotSchema) === 'callback'
            ? `${key}={(${parameters}) => <${cleanName} item={${itemExpression}} />}`
            : `${key}={<${cleanName} item={{}} />}`
        }
      }

      if (typeof value === 'string') {
        const itemBinding = getItemBinding(value)

        return itemBinding ? `${key}={${itemBinding}}` : `${key}={${JSON.stringify(value)}}`
      }

      if (typeof value === 'boolean') {
        return value ? key : `${key}={false}`
      }

      return `${key}={${JSON.stringify(value)}}`
    })

  return { slotSchemas, processedSlots, propsEntries }
}
