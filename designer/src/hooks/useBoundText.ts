import { registry } from '../registry'
import { useEditorStore } from '../stores/editor'
import type { DesignNode } from '../types/document'
import { findNode } from '../utils/nodes'

/** Subscribe only to the chosen scalar value, so unrelated typing does not rerender every label. */
export const useBoundText = (node: DesignNode): string | undefined =>
  useEditorStore((state) => {
    if (!node.textBinding) {
      return undefined
    }

    if (!state.previewMode) {
      return node.textBinding.designText?.trim()
        ? node.textBinding.designText
        : String(node.props.children ?? '')
    }

    const source = findNode(state.nodes, node.textBinding.sourceNodeId)
    const binding = source && registry[source.type]?.previewValue

    if (!source || !binding) {
      return undefined
    }

    const value = state.prototypeValues[source.id]

    return value === undefined || value === null || value === ''
      ? String(node.props.children ?? '')
      : String(value)
  })
