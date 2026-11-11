import { getAdapter } from '@root/adapters'
import type { FrameExportSelection } from '@root/types/frameExport'
import { type DesignDocument, parseDesignDocument } from '@root/utils/designDocument'
import { getFlatDesignDocument } from '@root/utils/flatDocument'
import { getAllNodes } from '@root/utils/flows/flowModel'

import { getFrameExportEligibility } from './getFrameExportEligibility'
import { getPrunedReferences } from './getPrunedReferences'
import { getReferencedSavedDesigns } from './getReferencedSavedDesigns'

export const getSelectedFrameExport = (
  input: unknown,
  selection: FrameExportSelection,
  expectedFrameIds?: string[],
  format: 'nested' | 'flat' = 'nested',
) => {
  const source = parseDesignDocument(input)
  const eligibility = getFrameExportEligibility(source, selection)

  if (!eligibility.eligible) {
    throw new Error(eligibility.code)
  }

  if (
    expectedFrameIds &&
    (expectedFrameIds.length !== eligibility.frameIds.length ||
      new Set(expectedFrameIds).size !== eligibility.frameIds.length ||
      expectedFrameIds.some((id) => !eligibility.frameIds.includes(id)))
  ) {
    throw new Error('FRAME_SELECTION_CHANGED: reread get_editor_context')
  }

  const included = new Set(eligibility.frameIds)

  for (const node of source.nodes) {
    if (node.overlay && included.has(node.overlay.ownerFrameId)) {
      included.add(node.id)
    }
  }

  const nodes = JSON.parse(
    JSON.stringify(
      source.nodes.filter(
        (node) =>
          included.has(node.id) || node.flow?.screens.some((screen) => included.has(screen.nodeId)),
      ),
    ),
  ) as DesignDocument['nodes']

  for (const node of nodes) {
    if (node.flow) {
      node.flow.screens = node.flow.screens.filter((screen) => included.has(screen.nodeId))

      if (!included.has(node.flow.startScreenId)) {
        node.flow.startScreenId = node.flow.screens.find(
          (screen) => screen.kind === 'screen',
        )!.nodeId
      }
    }
  }

  const savedDesigns = structuredClone(
    getReferencedSavedDesigns(
      nodes,
      source.savedDesigns ?? [],
      getAdapter(source.adapterId).registry,
    ),
  )

  const ids = new Set(getAllNodes(nodes).map((node) => node.id))
  const omitted = getPrunedReferences(nodes, ids)

  for (const saved of savedDesigns) {
    const templateIds = new Set([...ids, ...getAllNodes(saved.nodes).map((node) => node.id)])
    const removed = getPrunedReferences(saved.nodes, templateIds)

    omitted.interactions.push(...removed.interactions)

    omitted.bindings.push(...removed.bindings)
  }

  const document = parseDesignDocument({
    ...source,
    pageNotes: '',
    pageAnnotations: [],
    savedDesigns,
    nodes,
  })

  return {
    scope: {
      kind: 'selected-frames' as const,
      frameIds: eligibility.frameIds,
      overlayIds: nodes.filter((node) => node.overlay).map((node) => node.id),
      omitted,
    },
    document: format === 'flat' ? getFlatDesignDocument(document) : document,
  }
}
