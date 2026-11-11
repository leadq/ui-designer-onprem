import type { FrameExportEligibility, FrameExportSelection } from '@root/types/frameExport'
import type { DesignDocument } from '@root/utils/designDocument'
import { getAllNodes } from '@root/utils/flows/flowModel'

import { getCompleteFrameIds } from './getCompleteFrameIds'

export const getFrameExportEligibility = (
  document: Pick<DesignDocument, 'nodes'>,
  selection: FrameExportSelection,
): FrameExportEligibility => {
  const getResult = (code: FrameExportEligibility['code']): FrameExportEligibility => ({
    eligible: code === 'READY',
    code,
    frameIds: code === 'READY' ? frameIds : [],
  })

  const frameIds = document.nodes
    .filter((node) => selection.selectedFrameIds.includes(node.id))
    .map((node) => node.id)

  if (selection.previewMode) {
    return getResult('PREVIEW_DISABLED')
  }

  if (!selection.selectedFrameIds.length) {
    return getResult('FRAME_SELECTION_REQUIRED')
  }

  const frames = document.nodes.filter((node) => frameIds.includes(node.id))

  if (
    frames.length !== new Set(selection.selectedFrameIds).size ||
    frames.some((frame) => frame.type !== 'designerFrame')
  ) {
    return getResult('STALE_FRAME_SELECTION')
  }

  const covered = new Set(getAllNodes(frames).map((node) => node.id))

  if (
    selection.selectedNodeIds.some((id) => !covered.has(id)) ||
    selection.selectedReferenceIds?.length
  ) {
    return getResult('MIXED_SELECTION')
  }

  const complete = getCompleteFrameIds(document.nodes, selection.selectedNodeIds)

  if (
    selection.selectedNodeIds.length &&
    frames.some((frame) => frame.children.length && !complete.includes(frame.id))
  ) {
    return getResult('INCOMPLETE_FRAME_SELECTION')
  }

  return getResult('READY')
}
