import { registry } from '@root/registry'
import type { Registry } from '@root/types/componentContract'
import type { DesignAnnotation, DesignNode, SlotComponent } from '@root/types/document'
import { validateComponentContract } from '@root/utils/designer/componentContract'
import { getFlowExport } from '@root/utils/flows/flowExport'
import { getAllNodes } from '@root/utils/flows/flowModel'

import { NESTED_JSX_INDENT, ROOT_CHILD_JSX_INDENT } from './constants'
import { getNodeJSX } from './getNodeJSX'
import { getResolvedExportConfig } from './getResolvedExportConfig'
import { getSlotComponentIdentifier } from './getSlotComponentIdentifier'
import type { UsedComponents } from './types'

/**
 * Generates the TSX helper component for a slot component.
 */
const getGenerateSlotComponent = (
  component: SlotComponent,
  usedComponents: UsedComponents,
  usedSlotComponents: Set<string>,
  slotComponents: SlotComponent[],
  componentRegistry: Registry,
): string => {
  const cleanName = getSlotComponentIdentifier(component)
  const { nodes } = component
  const designNote = `// Saved design: ${JSON.stringify(component.name)}\n`

  if (nodes.length === 1) {
    const nodeJSX = getNodeJSX(
      nodes[0],
      NESTED_JSX_INDENT,
      usedComponents,
      usedSlotComponents,
      slotComponents,
      componentRegistry,
    ).trimStart()

    return `${designNote}const ${cleanName} = ({ item }: { item: any }) => {\n  return (\n    ${nodeJSX}\n  );\n};\n`
  }

  const nodesJSX = nodes
    .map((node) =>
      getNodeJSX(
        node,
        ROOT_CHILD_JSX_INDENT,
        usedComponents,
        usedSlotComponents,
        slotComponents,
        componentRegistry,
      ),
    )
    .join('\n')

  return `${designNote}const ${cleanName} = ({ item }: { item: any }) => {\n  return (\n    <>\n${nodesJSX}\n    </>\n  );\n};\n`
}

/**
 * Generates a complete TSX page from a DesignNode tree.
 * Produces grouped imports + a single exported functional component.
 * Includes page-level and node-level notes as JSX comments.
 */
export const getExportedTSX = (
  nodes: DesignNode[],
  componentName = 'GeneratedPage',
  pageNotes = '',
  pageAnnotations: DesignAnnotation[] = [],
  slotComponents: SlotComponent[] = [],
  componentRegistry: Registry = registry,
): string => {
  validateComponentContract(nodes, componentRegistry)

  slotComponents.forEach((design) => {
    validateComponentContract(design.nodes, componentRegistry)
  })

  const usedComponents: UsedComponents = new Map()
  const usedSlotComponents = new Set<string>()

  const jsxBody = nodes
    .map((node) =>
      getNodeJSX(
        node,
        ROOT_CHILD_JSX_INDENT,
        usedComponents,
        usedSlotComponents,
        slotComponents,
        componentRegistry,
      ),
    )
    .join('\n')

  // Generate helper components for used slot components
  const slotHelpers: string[] = []

  for (const slotComponentId of usedSlotComponents) {
    const component = slotComponents.find((child) => child.id === slotComponentId)

    if (component) {
      slotHelpers.push(
        getGenerateSlotComponent(
          component,
          usedComponents,
          usedSlotComponents,
          slotComponents,
          componentRegistry,
        ),
      )
    }
  }

  const slotComponentsStr = slotHelpers.join('\n')

  // Generate imports grouped by path
  const importStatements = Array.from(usedComponents.entries())
    .map(([path, collectedImport]) => {
      const importParts: string[] = []

      if (collectedImport.defaultName) {
        importParts.push(collectedImport.defaultName)
      }

      if (collectedImport.named.size > 0) {
        importParts.push(`{ ${Array.from(collectedImport.named).sort().join(', ')} }`)
      }

      return `import ${importParts.join(', ')} from '${path}';`
    })
    .join('\n')

  // Page-level notes comment block
  let pageNoteBlock = ''

  if (pageNotes.trim().length > 0) {
    const noteLines = pageNotes.trim().replaceAll('*/', '*\\/').split('\n')

    pageNoteBlock = `    {/* @page-note:\n${noteLines.map((line) => `       ${line}`).join('\n')}\n    */}\n`
  }

  if (pageAnnotations.length > 0) {
    const serializedAnnotations = JSON.stringify(pageAnnotations).replaceAll('*/', '*\\/')

    pageNoteBlock += `    {/* @page-annotations: ${serializedAnnotations} */}\n`
  }

  const slotComponentsSection = slotComponentsStr ? `${slotComponentsStr}\n` : ''

  const helperCode = [
    ...new Set(
      getAllNodes([
        ...nodes,
        ...slotComponents
          .filter((item) => usedSlotComponents.has(item.id))
          .flatMap((item) => item.nodes),
      ]).flatMap((node) => getResolvedExportConfig(node, componentRegistry)?.supportCode ?? []),
    ),
  ].join('\n')

  return `${importStatements}\n${helperCode}\n\n${slotComponentsSection}${getFlowExport(nodes, componentName, componentRegistry)}export const ${componentName} = () => {\n  return (\n    <>\n${pageNoteBlock}${jsxBody}\n    </>\n  );\n};\n`
}
