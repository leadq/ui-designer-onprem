import type { ComponentMeta, Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { getNodeSizingStyle } from '@root/utils/layout/getNodeSizingStyle'

export const getDesignExportAttributes = (
  node: DesignNode,
  parent: DesignNode | undefined,
  componentRegistry: Registry,
  exportConfig: ComponentMeta['exportConfig'],
) => {
  const propsEntries: string[] = []

  propsEntries.push(`data-designer-id={${JSON.stringify(node.id)}}`)

  if (node.overlay) {
    propsEntries.push(`data-designeroverlay={${JSON.stringify(node.overlay)}}`)
  }

  if (node.stateRules) {
    propsEntries.push(`data-designerstate={${JSON.stringify(node.stateRules)}}`)
  }

  if (node.textBinding) {
    propsEntries.push(`data-designertextbinding={${JSON.stringify(node.textBinding)}}`)
  }

  if (node.flow) {
    propsEntries.push(`data-designerflow={${JSON.stringify(node.flow)}}`)
  }

  // Build style string
  const styleEntries = Object.entries(
    getNodeSizingStyle(node, parent, null, componentRegistry),
  ).filter(([, value]) => value !== undefined)

  if (styleEntries.length > 0) {
    const styleStr = styleEntries
      .map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)}`)
      .join(', ')

    propsEntries.push(`style={{ ${styleStr} }}`)
  }

  // Add Responsive Styles as data-attribute if present
  if (node.responsiveStyles && Object.keys(node.responsiveStyles).length > 0) {
    propsEntries.push(`data-designerstyles={${JSON.stringify(node.responsiveStyles)}}`)
  }

  if (node.responsiveProps && Object.keys(node.responsiveProps).length) {
    propsEntries.push(`data-designerprops={${JSON.stringify(node.responsiveProps)}}`)
  }

  if (node.styleTokens) {
    propsEntries.push(`data-designercolortokens={${JSON.stringify(node.styleTokens)}}`)
  }

  if (node.responsiveStyleTokens) {
    propsEntries.push(
      `data-designerresponsivecolortokens={${JSON.stringify(node.responsiveStyleTokens)}}`,
    )
  }

  // Add Notes as data-attribute if present
  if (node.notes && node.notes.trim().length > 0) {
    propsEntries.push(`data-designernotes={${JSON.stringify(node.notes.trim())}}`)
  }

  if (node.annotations && node.annotations.length > 0) {
    propsEntries.push(`data-designerannotations={${JSON.stringify(node.annotations)}}`)
  }

  if (node.interactions && node.interactions.length > 0) {
    propsEntries.push(`data-designerinteractions={${JSON.stringify(node.interactions)}}`)
  }

  if (node.prototypeHidden) {
    propsEntries.push('data-prototypehidden')
  }

  if (exportConfig?.agentPlaceholder) {
    propsEntries.push(`data-agentplaceholder={${JSON.stringify(exportConfig.agentPlaceholder)}}`)
  }

  return propsEntries
}
