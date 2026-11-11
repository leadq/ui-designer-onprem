import { useEditorStore } from '@root/stores/editor'
import { findNode } from '@root/utils/nodes'

export const activateCanvasViewAtPoint = (positionX: number, positionY: number) => {
  const target = document
    .elementsFromPoint(positionX, positionY)
    .find((element) => element.closest('[data-view-id]'))

  const view = target?.closest<HTMLElement>('[data-view-id]')
  const frame = target?.closest<HTMLElement>('[data-frame-surface], [data-design-modal]')
  const width = Number(view?.dataset.viewWidth)
  const frameId = frame?.dataset.frameSurface ?? frame?.dataset.designModal
  const state = useEditorStore.getState()

  const editingNode = state.editingFlowScreenId
    ? findNode(state.nodes, state.editingFlowScreenId)
    : null

  // Entering the owner frame on the way to its open modal must not close the drop target.
  if (
    frameId &&
    state.editingFlowScreenId !== frameId &&
    editingNode?.overlay?.ownerFrameId !== frameId
  ) {
    state.editFlowScreen(frameId)
  }

  if (width && state.canvasWidth !== width) {
    state.setCanvasWidth(width)
  }
}
