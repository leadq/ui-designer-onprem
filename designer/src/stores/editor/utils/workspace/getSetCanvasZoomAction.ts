import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { getCanvasScale } from '@root/utils/canvas/zoom'

export const getSetCanvasZoomAction =
  (set: EditorStoreSet): EditorActions['setCanvasZoom'] =>
  (zoom) =>
    set((state) => {
      state.canvasZoom = getCanvasScale(zoom)
    })
