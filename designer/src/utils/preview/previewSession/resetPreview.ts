import { getAdapter } from '@root/adapters'
import { setActiveRegistry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { normalizeFrameWorkspace } from '@root/utils/frames/frameWorkspace'
import { getBreakpointForWidth } from '@root/utils/layout/getBreakpointForWidth'

import type { PreviewSnapshot } from './types'

export const resetPreview = (snapshot: PreviewSnapshot) => {
  const document = snapshot.document
  const adapter = getAdapter(document.adapterId)

  setActiveRegistry(document.adapterId)

  const nodes = normalizeFrameWorkspace(
    document.nodes,
    adapter.registry,
    adapter.defaultContainerType,
  )

  useEditorStore.setState({
    nodes,
    adapterId: document.adapterId,
    pageName: document.pageName,
    pageNotes: document.pageNotes,
    pageAnnotations: document.pageAnnotations,
    slotComponents: document.savedDesigns ?? [],
    selectedNodeIds: [],
    focusedContainerId: null,
    previewMode: false,
    outlineMode: 'selection',
    canvasZoom: 1,
    canvasWidth: window.innerWidth,
    activeBreakpoint: getBreakpointForWidth(window.innerWidth),
  })

  useEditorStore.getState().togglePreviewMode()

  const owner =
    nodes.find((node) => node.id === snapshot.flowId && node.flow) ??
    nodes.find((node) => node.flow)

  const otherScreens = nodes
    .filter((node) => node.flow && node.id !== owner?.id)
    .flatMap((node) => node.flow!.screens.map((screen) => screen.nodeId))

  useEditorStore.setState((state) => ({
    prototypeHiddenNodeIds: [...new Set([...state.prototypeHiddenNodeIds, ...otherScreens])],
  }))
}
