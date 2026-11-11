import { useEditorStore } from '@root/stores/editor'
import { getFrameForNode } from '@root/utils/frames/frameWorkspace'

import { getCanvasScale } from '../zoom'

import { CANVAS_FIT_GUTTERS } from './constants/fitGutters'

const OPPOSITE_SIDES = 2
const HALF_SIZE_DIVISOR = 2
const FIT_SCALE_TOLERANCE = 0.0001
const MAX_FIT_ITERATIONS = 8

export const fitCanvas = (shouldFitAllFrames = false) => {
  const viewport = document.getElementById('canvas-scroll-container')
  const layer = document.getElementById('render-layer')
  let pendingFrame = 0
  let iteration = 0
  const cancel = () => cancelAnimationFrame(pendingFrame)

  if (!viewport || !layer || useEditorStore.getState().previewMode) {
    return cancel
  }

  const activeId = useEditorStore.getState().editingFlowScreenId
  const active = activeId ? getFrameForNode(useEditorStore.getState().nodes, activeId) : null
  const targetId = active?.overlay?.ownerFrameId ?? activeId
  const frames = Array.from(layer.querySelectorAll<HTMLElement>('[data-frame-surface]'))

  const targets = shouldFitAllFrames
    ? [...frames, ...viewport.querySelectorAll<HTMLElement>('[data-reference-id]')]
    : frames.filter((frame) => frame.dataset.frameSurface === targetId)

  // Frame surfaces already include their title. View labels and the add-view
  // control are navigation chrome, not part of the design's fit bounds.
  const elements = targets.length ? targets : frames

  if (!elements.length) {
    return cancel
  }

  const update = () => {
    if (!viewport.isConnected || !layer.isConnected) {
      return
    }

    const rects = elements.map((element) => element.getBoundingClientRect())
    const left = Math.min(...rects.map((rect) => rect.left))
    const top = Math.min(...rects.map((rect) => rect.top))
    const width = Math.max(...rects.map((rect) => rect.right)) - left
    const height = Math.max(...rects.map((rect) => rect.bottom)) - top

    if (!width || !height || !viewport.clientWidth || !viewport.clientHeight) {
      return
    }

    // Screen-space gutters include the frame names and keep bottom controls clear.
    const horizontalGutter = CANVAS_FIT_GUTTERS.horizontal
    const topGutter = CANVAS_FIT_GUTTERS.top
    const bottomGutter = CANVAS_FIT_GUTTERS.bottom
    const availableWidth = Math.max(1, viewport.clientWidth - horizontalGutter * OPPOSITE_SIDES)
    const availableHeight = Math.max(1, viewport.clientHeight - topGutter - bottomGutter)
    const state = useEditorStore.getState()

    const zoom = getCanvasScale(
      Math.min(1, state.canvasZoom * Math.min(availableWidth / width, availableHeight / height)),
    )

    if (Math.abs(zoom - state.canvasZoom) > FIT_SCALE_TOLERANCE && iteration < MAX_FIT_ITERATIONS) {
      iteration += 1

      state.setCanvasZoom(zoom)

      // Headings partially compensate zoom, so remeasure after React has painted.
      pendingFrame = requestAnimationFrame(update)

      return
    }

    const bounds = viewport.getBoundingClientRect()

    viewport.scrollLeft +=
      left - bounds.left - horizontalGutter - (availableWidth - width) / HALF_SIZE_DIVISOR

    viewport.scrollTop +=
      top - bounds.top - topGutter - (availableHeight - height) / HALF_SIZE_DIVISOR
  }

  pendingFrame = requestAnimationFrame(update)

  return cancel
}
