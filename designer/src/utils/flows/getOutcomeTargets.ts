import type { DesignNode } from '@root/types/document'
import type { InteractionOutcome } from '@root/types/preview'
import { getAllNodes, getContainingScreen } from '@root/utils/flows/flowModel'
import { getNodeOptions } from '@root/utils/getNodeOptions'

export const getOutcomeTargets = (
  nodes: DesignNode[],
  sourceId: string,
  action: InteractionOutcome['action'],
) => {
  const options = getNodeOptions(nodes)

  if (['show', 'hide', 'toggle'].includes(action)) {
    return options
  }

  const source = getContainingScreen(nodes, sourceId)

  const allowed = getAllNodes(nodes).flatMap(
    (node) =>
      node.flow?.screens
        .filter((screen) => screen.kind === (action === 'goTo' ? 'screen' : 'overlay'))
        .map((screen) => screen.nodeId) ?? [],
  )

  const baseScreenId = source?.overlay?.ownerFrameId ?? source?.id

  return options.filter((option) => {
    if (!allowed.includes(option.value)) {
      return false
    }

    if (action === 'goTo') {
      return option.value !== source?.id
    }

    const target = getAllNodes(nodes).find((node) => node.id === option.value)

    // Legacy overlays without an owner remain usable; owned windows belong to one screen.
    return !target?.overlay || target.overlay.ownerFrameId === baseScreenId
  })
}
