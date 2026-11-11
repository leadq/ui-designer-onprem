import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getSetActiveBreakpointAction =
  (set: EditorStoreSet): EditorActions['setActiveBreakpoint'] =>
  (bp) =>
    set((state) => {
      state.activeBreakpoint = bp

      state.canvasWidth = BREAKPOINT_MAP[bp]
    })
