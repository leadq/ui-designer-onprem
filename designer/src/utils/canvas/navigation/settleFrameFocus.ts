import { flushSync } from 'react-dom'
import { useEditorStore } from '@root/stores/editor'

import { getFrameCamera } from './getFrameCamera'

const MAX_PASSES = 8
const SCALE_TOLERANCE = 0.0001

/** Heading compensation is nonlinear: finish fitting before the browser paints the final camera. */
export const settleFrameFocus = (viewport: HTMLElement, frame: HTMLElement) => {
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    const state = useEditorStore.getState()
    const rect = frame.getBoundingClientRect()

    const camera = getFrameCamera({
      width: rect.width,
      height: rect.height,
      viewportWidth: viewport.clientWidth,
      viewportHeight: viewport.clientHeight,
      zoom: state.canvasZoom,
    })

    if (Math.abs(camera.zoom - state.canvasZoom) <= SCALE_TOLERANCE) {
      return
    }

    flushSync(() => state.setCanvasZoom(camera.zoom))
  }
}
