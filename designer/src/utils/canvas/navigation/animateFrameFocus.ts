import { flushSync } from 'react-dom'
import { useEditorStore } from '@root/stores/editor'

import { getFrameCamera } from './getFrameCamera'
import { settleFrameFocus } from './settleFrameFocus'

const DURATION_MS = 300
const EASING_POWER = 3
const HALF = 2
let cancelActiveFocus: (() => void) | undefined

/** Scale and scroll are committed together, so there is no delayed scroll correction. */
export const animateFrameFocus = (viewport: HTMLElement, frame: HTMLElement, targetId: string) => {
  cancelActiveFocus?.()

  const startZoom = useEditorStore.getState().canvasZoom
  const bounds = viewport.getBoundingClientRect()
  const startRect = frame.getBoundingClientRect()

  const startCenter = {
    x: (startRect.left + startRect.right) / HALF - bounds.left,
    y: (startRect.top + startRect.bottom) / HALF - bounds.top,
  }

  const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : DURATION_MS
  let pendingFrame = 0
  let startTime: number | undefined

  const cancel = () => {
    cancelAnimationFrame(pendingFrame)

    for (const type of ['pointerdown', 'wheel', 'keydown']) {
      document.removeEventListener(type, cancel, true)
    }

    if (cancelActiveFocus === cancel) {
      cancelActiveFocus = undefined
    }
  }

  const update = (time: number) => {
    const state = useEditorStore.getState()

    if (
      !viewport.isConnected ||
      !frame.isConnected ||
      state.previewMode ||
      state.editingFlowScreenId !== targetId
    ) {
      cancel()

      return
    }

    startTime = startTime ?? time

    const progress = duration ? Math.min(1, (time - startTime) / duration) : 1
    const eased = 1 - (1 - progress) ** EASING_POWER
    const rect = frame.getBoundingClientRect()

    const camera = getFrameCamera({
      width: rect.width,
      height: rect.height,
      viewportWidth: viewport.clientWidth,
      viewportHeight: viewport.clientHeight,
      zoom: state.canvasZoom,
    })

    flushSync(() => state.setCanvasZoom(startZoom + (camera.zoom - startZoom) * eased))

    if (progress === 1) {
      settleFrameFocus(viewport, frame)
    }

    // Measure after the same-frame React commit: heading compensation and workspace origin can change.
    const next = frame.getBoundingClientRect()
    const viewportBounds = viewport.getBoundingClientRect()

    viewport.scrollLeft +=
      (next.left + next.right) / HALF -
      viewportBounds.left -
      (startCenter.x + (camera.centerX - startCenter.x) * eased)

    viewport.scrollTop +=
      (next.top + next.bottom) / HALF -
      viewportBounds.top -
      (startCenter.y + (camera.centerY - startCenter.y) * eased)

    if (progress < 1) {
      pendingFrame = requestAnimationFrame(update)
    } else {
      cancel()
    }
  }

  for (const type of ['pointerdown', 'wheel', 'keydown']) {
    document.addEventListener(type, cancel, true)
  }

  cancelActiveFocus = cancel

  pendingFrame = requestAnimationFrame(update)

  return cancel
}
