import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { getFrameIds } from './getFrameIds'
import { getNewFrame } from './getNewFrame'
import { getNextFrameLabel } from './getNextFrameLabel'
import { normalizeStructuralNodes } from './normalizeStructuralNodes'
import { promoteFlowFrames } from './promoteFlowFrames'

/** A legacy page becomes one frame; flow collections become metadata + sibling frames. */
export const getNormalizedFrameWorkspace = (
  nodes: DesignNode[],
  _registry: Registry,
  type: string,
): DesignNode[] => {
  const result = structuredClone(nodes)

  promoteFlowFrames(result)

  let owner = result.find((node) => node.flow?.layout === 'root')
  const ids = getFrameIds(result)
  const loose = result.filter((node) => !node.flow && !ids.has(node.id))

  if (!owner) {
    owner = { ...getNewFrame('Frames'), type: 'designerFlow' }

    owner.label = 'Frames'

    owner.flow = { layout: 'root', startScreenId: '', screens: [] }

    result.unshift(owner)
  }

  if (loose.length || !owner.flow!.screens.length) {
    const frame = getNewFrame(getNextFrameLabel(result))

    frame.children = loose

    owner.flow!.screens.push({ nodeId: frame.id, kind: 'screen' })

    if (!owner.flow!.startScreenId) {
      owner.flow!.startScreenId = frame.id
    }

    result.push(frame)
  }

  const workspace = result.filter((node) => !loose.includes(node))

  normalizeStructuralNodes(workspace, type)

  return workspace
}
