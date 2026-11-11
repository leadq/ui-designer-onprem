import { registry } from '@root/registry'
import type { ComponentMeta, Registry } from '@root/types/componentContract'
import type { DesignNode, SlotComponent } from '@root/types/document'
import { getNodeSizingStyle } from '@root/utils/layout/getNodeSizingStyle'
import { getSlotRenderMode } from '@root/utils/slotRendering'

import { NESTED_JSX_INDENT } from './constants'
import { getDesignExportAttributes } from './getDesignExportAttributes'
import { getItemBinding } from './getItemBinding'
import { getNativeExportProps } from './getNativeExportProps'
import { getResolvedExportConfig } from './getResolvedExportConfig'
import { getStructuredNodeJSX } from './getStructuredNodeJSX'
import { getUsedComponentImports } from './getUsedComponentImports'
import type { UsedComponents } from './types'

const INDENT_SIZE = 2

/**
 * Tracks used imports and converts a single DesignNode into a JSX string.
 * Exported separately so that Code Preview (B4) can render individual nodes.
 */
export const getNodeJSX = (
  node: DesignNode,
  indent = 2,
  usedComponents?: UsedComponents,
  usedSlotComponents?: Set<string>,
  slotComponents: SlotComponent[] = [],
  componentRegistry: Registry = registry,
  parent?: DesignNode,
): string => {
  if (node.flow?.layout === 'root' || node.type === 'designerFlow') {
    return ''
  }

  if (node.type === 'designerFrame') {
    const content = node.children
      .map((child) =>
        getNodeJSX(
          child,
          indent + INDENT_SIZE,
          usedComponents,
          usedSlotComponents,
          slotComponents,
          componentRegistry,
          node,
        ),
      )
      .join('\n')

    const hostNote =
      getNodeSizingStyle(node, parent, null, componentRegistry).display === 'flex'
        ? `${' '.repeat(indent + INDENT_SIZE)}{/* Filled or centered children require the page host to provide a column flex layout and available height. */}\n`
        : ''

    return `${' '.repeat(indent)}<>\n${hostNote}${content}\n${' '.repeat(indent)}</>`
  }

  const meta: ComponentMeta | undefined = componentRegistry[node.type]
  const exportConfig = getResolvedExportConfig(node, componentRegistry)

  const componentName =
    exportConfig?.jsxName ??
    exportConfig?.importName ??
    node.type.charAt(0).toUpperCase() + node.type.slice(1)

  getUsedComponentImports(exportConfig, componentName, usedComponents)

  const spaces = ' '.repeat(indent)

  const structured = getStructuredNodeJSX(
    node,
    indent,
    usedComponents,
    usedSlotComponents,
    slotComponents,
    componentRegistry,
    parent,
  )

  if (structured !== null) {
    return structured
  }

  const { slotSchemas, processedSlots, propsEntries } = getNativeExportProps(
    node,
    meta,
    slotComponents,
    usedSlotComponents,
  )

  propsEntries.push(...getDesignExportAttributes(node, parent, componentRegistry, exportConfig))

  // Build slots JSX (fallback for inline/legacy slots)
  if (node.slots) {
    for (const [slotKey, slotNodes] of Object.entries(node.slots)) {
      // Only compile inline slot if not already processed as a global slot component
      if (slotNodes.length > 0 && !processedSlots.has(slotKey)) {
        const slotJSX = slotNodes
          .map((slotNode) =>
            getNodeJSX(
              slotNode,
              indent + NESTED_JSX_INDENT,
              usedComponents,
              usedSlotComponents,
              slotComponents,
              componentRegistry,
            ),
          )
          .join('\n')
          .trimStart()

        const slotContent = slotNodes.length > 1 ? `<>${slotJSX}</>` : slotJSX
        const spaceIndent = ' '.repeat(indent + INDENT_SIZE)
        const schema = slotSchemas.find((field) => field.key === slotKey)

        if (schema && getSlotRenderMode(schema) === 'callback') {
          if (schema.slotArgumentNames) {
            const parameters = schema.slotArgumentNames.map((_, index) => `arg${index}`).join(', ')

            const fields = schema.slotArgumentNames
              .map((name, index) => `${JSON.stringify(name)}: arg${index}`)
              .join(', ')

            propsEntries.push(
              `${slotKey}={(${parameters}) => { const item = { ${fields} }; return (\n    ${slotContent}\n${spaceIndent}); }}`,
            )
          } else {
            propsEntries.push(`${slotKey}={(item) => (\n    ${slotContent}\n${spaceIndent})}`)
          }
        } else {
          propsEntries.push(`${slotKey}={(\n    ${slotContent}\n${spaceIndent})}`)
        }
      }
    }
  }

  const propsStr = propsEntries.length > 0 ? ` ${propsEntries.join(' ')}` : ''
  const childrenProp = node.props.children

  const childrenJSX =
    node.children.length > 0
      ? node.children
          .map((child) => {
            const jsx = getNodeJSX(
              child,
              indent + INDENT_SIZE,
              usedComponents,
              usedSlotComponents,
              slotComponents,
              componentRegistry,
              node,
            )

            return exportConfig?.wrapChild ? exportConfig.wrapChild(jsx) : jsx
          })
          .join('\n')
      : typeof childrenProp === 'string' || typeof childrenProp === 'number'
        ? `{${typeof childrenProp === 'string' ? (getItemBinding(childrenProp) ?? JSON.stringify(childrenProp)) : childrenProp}}`
        : ''

  if (exportConfig?.renderJSX) {
    return spaces + exportConfig.renderJSX(node, propsEntries, childrenJSX)
  }

  return childrenJSX
    ? `${spaces}<${componentName}${propsStr}>\n${childrenJSX}\n${spaces}</${componentName}>`
    : `${spaces}<${componentName}${propsStr} />`
}
