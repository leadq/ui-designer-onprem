import { useEditorStore } from '@root/stores/editor'
import { useReferenceStore } from '@root/stores/referenceStore'
import { getSelectedFrameExport } from '@root/utils/frames/frameExport/getSelectedFrameExport'

import { getLiveDocument } from './getLiveDocument'
import { getLiveTarget } from './getLiveTarget'

export const getSelectedFrameResult = (args: Record<string, unknown>) => {
  const target = getLiveTarget()

  if (args.expectedVersion !== target.version) {
    throw new Error('DESIGN_CONFLICT: reread current context')
  }

  if (
    !Array.isArray(args.frameIds) ||
    !args.frameIds.length ||
    args.frameIds.some((id) => typeof id !== 'string')
  ) {
    throw new Error('FRAME_SELECTION_REQUIRED')
  }

  const state = useEditorStore.getState()
  const selection = { ...state, selectedReferenceIds: useReferenceStore.getState().selectedIds }

  const exported = getSelectedFrameExport(
    getLiveDocument(),
    selection,
    args.frameIds as string[],
    args.format === 'flat' ? 'flat' : 'nested',
  )

  return { ...target, ...exported }
}
