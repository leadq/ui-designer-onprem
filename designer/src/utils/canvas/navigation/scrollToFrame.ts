import { useEditorStore } from '@root/stores/editor'
import { getNodeElement } from '@root/utils/canvas/hitTesting'
import { getFrameForNode } from '@root/utils/frames/frameWorkspace'

export const scrollToFrame = (id: string | null) => {
  const frame = id ? getFrameForNode(useEditorStore.getState().nodes, id) : null

  id = frame?.overlay?.ownerFrameId ?? id

  if (id) {
    getNodeElement(id)
      ?.closest('[data-frame-surface]')
      ?.scrollIntoView({ block: 'start', inline: 'center', behavior: 'instant' })
  }
}
