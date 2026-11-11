import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { getBreakpointForWidth } from '@root/utils/layout/getBreakpointForWidth'

export const getSetCanvasWidthAction =
  (set: EditorStoreSet): EditorActions['setCanvasWidth'] =>
  (width) =>
    set((state) => {
      state.canvasWidth = width

      state.activeBreakpoint = width === null ? 'xl' : getBreakpointForWidth(width)
    })
