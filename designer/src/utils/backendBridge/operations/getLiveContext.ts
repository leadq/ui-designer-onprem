import { useEditorStore } from '@root/stores/editor'
import { useReferenceStore } from '@root/stores/referenceStore'
import { getSelectionContext } from '@root/utils/designer/selectionContext'
import { getFrameExportEligibility } from '@root/utils/frames/frameExport/getFrameExportEligibility'
import { getReferencePlacement } from '@root/utils/references/placement'

import { getLiveDocument, getLiveTarget, getValueHash } from './document'

const MAX_ROW_TOLERANCE = 80
const MIN_ROW_TOLERANCE = 24
const HEIGHT_DIVISOR = 4

const getReferences = () => {
  const state = useReferenceStore.getState()

  const items = state.images
    .map((image) => {
      const placement = getReferencePlacement(image)

      return {
        id: image.id,
        name: image.name,
        width: image.width,
        height: image.height,
        x: placement.x,
        y: placement.y,
        displayWidth: placement.width,
        selected: state.selectedIds.includes(image.id),
        availableForAnalysis: true,
      }
    })
    .sort(
      (first, second) =>
        first.y - second.y || first.x - second.x || first.id.localeCompare(second.id),
    )

  const rows: { top: number; height: number; items: typeof items }[] = []

  for (const item of items) {
    const height = (item.displayWidth * item.height) / item.width

    const row = rows.find(
      (candidate) =>
        Math.abs(candidate.top - item.y) <=
        Math.min(
          MAX_ROW_TOLERANCE,
          Math.max(MIN_ROW_TOLERANCE, Math.min(candidate.height, height) / HEIGHT_DIVISOR),
        ),
    )

    if (row) {
      row.items.push(item)
    } else {
      rows.push({ top: item.y, height, items: [item] })
    }
  }

  return rows
    .flatMap((row, rowIndex) =>
      row.items
        .sort((first, second) => first.x - second.x || first.id.localeCompare(second.id))
        .map((item, columnIndex) => ({ ...item, row: rowIndex + 1, column: columnIndex + 1 })),
    )
    .map((item, index) => ({ ...item, order: index + 1 }))
}

export const getLiveContext = async () => {
  const state = useEditorStore.getState()
  const document = getLiveDocument()
  const target = getLiveTarget()
  const documentHash = await getValueHash(document)

  if (
    state.selectedNodeIds !== useEditorStore.getState().selectedNodeIds ||
    state.selectedFrameIds !== useEditorStore.getState().selectedFrameIds ||
    state.canvasWidth !== useEditorStore.getState().canvasWidth ||
    JSON.stringify(document) !== JSON.stringify(getLiveDocument()) ||
    target.designId !== getLiveTarget().designId
  ) {
    throw new Error('DESIGN_CONFLICT: reread current context')
  }

  const references = getReferences()

  return {
    ready: true,
    ...target,
    documentHash,
    adapterId: state.adapterId,
    selectedNodeIds: state.selectedNodeIds,
    selectedFrameIds: state.selectedFrameIds,
    frameExport: getFrameExportEligibility(document, {
      ...state,
      selectedReferenceIds: references.filter((image) => image.selected).map((image) => image.id),
    }),
    selectedNodes: getSelectionContext(document, state.selectedNodeIds, state.canvasWidth),
    activeFrameId: state.editingFlowScreenId,
    focusedContainerId: state.focusedContainerId,
    canvasWidth: state.canvasWidth,
    activeBreakpoint: state.activeBreakpoint,
    zoom: state.canvasZoom,
    previewMode: state.previewMode,
    references,
    selectedReferences: references.filter((image) => image.selected),
    capabilities: {
      targetedEdit: true,
      renderedScreenshot: false,
      isolatedFrameRender: 'render_design_frame',
    },
  }
}
