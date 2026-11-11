import { getAdapter } from '@root/adapters'
import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import { registry, setActiveRegistry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { parseDesignDocument } from '@root/utils/designDocument'
import { getStoredSavedDesigns } from '@root/utils/designer/storedDesigns'
import { getFrameInsertionTarget, normalizeFrameWorkspace } from '@root/utils/frames/frameWorkspace'

export const getLoadDesignDocumentAction =
  (set: EditorStoreSet): EditorActions['loadDesignDocument'] =>
  (document) => {
    document = parseDesignDocument(document)

    getAdapter(document.adapterId)

    setActiveRegistry(document.adapterId)

    set((state) => {
      state.workspaceRevision += 1

      if (state.adapterId !== document.adapterId) {
        state.slotComponents = getStoredSavedDesigns(document.adapterId)
      }

      state.adapterId = document.adapterId

      state.copiedNode = null

      state.focusedContainerId = null

      state.editingFlowScreenId = null

      state.dropTarget = null

      state.previewMode = false

      state.prototypeHiddenNodeIds = []

      state.saveDesignNodeIds = []

      state.nodes = normalizeFrameWorkspace(
        document.nodes,
        registry,
        getAdapter(state.adapterId).defaultContainerType,
      )

      state.focusedContainerId = getFrameInsertionTarget(state.nodes, null) ?? null

      state.editingFlowScreenId = state.focusedContainerId

      state.pageName = document.pageName

      state.pageNotes = document.pageNotes

      state.pageAnnotations = document.pageAnnotations

      state.canvasWidth = BREAKPOINT_MAP.xl

      state.activeBreakpoint = 'xl'

      state.selectedFrameIds = []

      state.selectedNodeIds = []

      state.selectedTableColumnKey = null

      state.history = [JSON.parse(JSON.stringify(state.nodes))]

      state.historyIndex = 0

      if (document.savedDesigns) {
        state.slotComponents = Array.from(
          new Map(
            [...state.slotComponents, ...document.savedDesigns].map((design) => [
              design.id,
              design,
            ]),
          ).values(),
        )
      }
    })
  }
