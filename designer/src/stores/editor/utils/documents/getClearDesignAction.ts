import { getAdapter } from '@root/adapters'
import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { getFrameInsertionTarget, normalizeFrameWorkspace } from '@root/utils/frames/frameWorkspace'

export const getClearDesignAction =
  (set: EditorStoreSet): EditorActions['clearDesign'] =>
  () =>
    set((state) => {
      state.workspaceRevision += 1

      state.copiedNode = null

      state.dropTarget = null

      state.saveDesignNodeIds = []

      state.interactionState = 'idle'

      state.canvasZoom = 1

      state.canvasWidth = BREAKPOINT_MAP.xl

      state.activeBreakpoint = 'xl'

      state.prototypeValues = {}

      state.prototypeExamples = {}

      state.prototypeConditionError = null

      state.prototypeFieldVisibility = {}

      state.prototypeOverlayTriggerIds = {}

      state.nodes = normalizeFrameWorkspace(
        [],
        registry,
        getAdapter(state.adapterId).defaultContainerType,
      )

      state.focusedContainerId = getFrameInsertionTarget(state.nodes, null) ?? null

      state.editingFlowScreenId = state.focusedContainerId

      state.previewMode = false

      state.prototypeHiddenNodeIds = []

      state.pageName = 'Untitled Page'

      state.pageNotes = ''

      state.pageAnnotations = []

      state.selectedFrameIds = []

      state.selectedNodeIds = []

      state.history = [JSON.parse(JSON.stringify(state.nodes))]

      state.historyIndex = 0
    })
