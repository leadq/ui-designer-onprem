import { useEditorStore } from '@root/stores/editor'
import { getSyncPayload } from '@root/utils/mcp/getSyncPayload'

import { getLiveDocument } from './getLiveDocument'
import { getLiveTarget } from './getLiveTarget'

export const getLiveDesign = (section: unknown) => {
  const document = getLiveDocument()

  if (section === 'document') {
    return { ...getLiveTarget(), document }
  }

  const state = useEditorStore.getState()

  return {
    ...getSyncPayload({ ...state, slotComponents: state.slotComponents }),
    ...getLiveTarget(),
  }
}
