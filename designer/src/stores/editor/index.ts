import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { DEFAULT_ADAPTER_ID, getAdapter } from '../../adapters'
import { setActiveRegistry } from '../../registry'
import { loadAutosavedDesign } from '../../utils/designDocument'
import { getStoredSavedDesigns } from '../../utils/designer/storedDesigns'
import { getFrameInsertionTarget, normalizeFrameWorkspace } from '../../utils/frames/frameWorkspace'

import { getAnnotationsActions } from './utils/getAnnotationsActions'
import { getCollectionActions } from './utils/getCollectionActions'
import { getDocumentsActions } from './utils/getDocumentsActions'
import { getFlowActions } from './utils/getFlowActions'
import { getNodesActions } from './utils/getNodesActions'
import { getPrototypeActions } from './utils/getPrototypeActions'
import { getSelectionActions } from './utils/getSelectionActions'
import { getSlotsActions } from './utils/getSlotsActions'
import { getStylesActions } from './utils/getStylesActions'
import { getTableActions } from './utils/getTableActions'
import { getTreeActions } from './utils/getTreeActions'
import { getWorkspaceActions } from './utils/getWorkspaceActions'
import type { EditorState } from './types'

const initialDesign = loadAutosavedDesign()
const initialAdapterId = initialDesign?.adapterId ?? DEFAULT_ADAPTER_ID

const initialNodes = normalizeFrameWorkspace(
  initialDesign?.nodes ?? [],
  getAdapter(initialAdapterId).registry,
  getAdapter(initialAdapterId).defaultContainerType,
)

setActiveRegistry(initialAdapterId)

const storedSavedDesigns = getStoredSavedDesigns(initialAdapterId)

const initialSavedDesigns = Array.from(
  new Map(
    [...storedSavedDesigns, ...(initialDesign?.savedDesigns ?? [])].map((design) => [
      design.id,
      design,
    ]),
  ).values(),
)

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      adapterId: initialAdapterId,
      nodes: initialNodes,
      selectedNodeIds: [],
      selectedFrameIds: [],
      selectedTableColumnKey: null,
      pageName: initialDesign?.pageName ?? 'Untitled Page',
      pageNotes: initialDesign?.pageNotes ?? '',
      pageAnnotations: initialDesign?.pageAnnotations ?? [],
      canvasWidth: 1440,
      canvasZoom: 1,
      workspaceRevision: 0,
      activeBreakpoint: 'xl',
      dropTarget: null,
      interactionState: 'idle',
      outlineMode: 'selection',
      history: [JSON.parse(JSON.stringify(initialNodes))],
      historyIndex: 0,
      copiedNode: null,
      slotComponents: initialSavedDesigns,
      saveDesignNodeIds: [],
      previewMode: false,
      prototypeValues: {},
      prototypeExamples: {},
      prototypeConditionError: null,
      prototypeFieldVisibility: {},
      prototypeHiddenNodeIds: [],
      prototypeOverlayTriggerIds: {},
      focusedContainerId: getFrameInsertionTarget(initialNodes, null) ?? null,
      editingFlowScreenId: getFrameInsertionTarget(initialNodes, null) ?? null,

      ...getFlowActions(set, get),
      ...getNodesActions(set),
      ...getStylesActions(set),
      ...getSelectionActions(set, get),
      ...getDocumentsActions(set, get),
      ...getTreeActions(set, get),
      ...getAnnotationsActions(set),
      ...getPrototypeActions(set),
      ...getWorkspaceActions(set),
      ...getSlotsActions(set),
      ...getTableActions(set),
      ...getCollectionActions(set),
    })),
  ),
)
