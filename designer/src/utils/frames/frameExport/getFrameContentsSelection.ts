import type { DesignNode } from '@root/types/document'
import type { FrameExportSelection } from '@root/types/frameExport'

/** Frame selection is independent of editable component selection. */
export const getFrameContentsSelection = (
  nodes: DesignNode[],
  id: string,
  selection: FrameExportSelection,
  isAdditive = false,
) => {
  const frame = nodes.find((node) => node.id === id && node.type === 'designerFrame')

  if (!frame) {
    return null
  }

  if (!isAdditive) {
    return { frameIds: [id], nodeIds: [] }
  }

  if (selection.selectedFrameIds.includes(id)) {
    return {
      frameIds: selection.selectedFrameIds.filter((selected) => selected !== id),
      nodeIds: [],
    }
  }

  return {
    frameIds: [...selection.selectedFrameIds, id],
    nodeIds: [],
  }
}
