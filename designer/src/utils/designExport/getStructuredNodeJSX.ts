import type { Registry } from '@root/types/componentContract'
import type { DesignNode, SlotComponent } from '@root/types/document'
import { isAuthoredTable } from '@root/utils/tableAuthoring/isAuthoredTable'

import { NESTED_JSX_INDENT } from './constants'
import { getDesignExportAttributes } from './getDesignExportAttributes'
import { getNodeJSX } from './getNodeJSX'
import type { UsedComponents } from './types'

export const getStructuredNodeJSX = (
  node: DesignNode,
  indent: number,
  usedComponents: UsedComponents | undefined,
  usedSlotComponents: Set<string> | undefined,
  slotComponents: SlotComponent[],
  componentRegistry: Registry,
  parent?: DesignNode,
): string | null => {
  const meta = componentRegistry[node.type]
  const exportConfig = meta?.exportConfig
  const spaces = ' '.repeat(indent)

  if (meta?.collection && exportConfig?.renderCollectionJSX) {
    const items = node.children.map((item) =>
      getNodeJSX(
        item,
        indent + NESTED_JSX_INDENT,
        usedComponents,
        usedSlotComponents,
        slotComponents,
        componentRegistry,
        node,
      ),
    )

    return (
      spaces +
      exportConfig.renderCollectionJSX(
        node,
        items,
        getDesignExportAttributes(node, parent, componentRegistry, exportConfig),
      )
    )
  }

  if (meta?.tableContents && isAuthoredTable(node) && exportConfig?.renderTableJSX) {
    const cells = (node.slots?.cellContents ?? []).map((cell) =>
      getNodeJSX(
        cell,
        indent + NESTED_JSX_INDENT,
        usedComponents,
        usedSlotComponents,
        slotComponents,
        componentRegistry,
      ),
    )

    return (
      spaces +
      exportConfig.renderTableJSX(
        node,
        cells,
        getDesignExportAttributes(node, parent, componentRegistry, {
          ...exportConfig,
          agentPlaceholder: undefined,
        }),
      )
    )
  }

  return null
}
