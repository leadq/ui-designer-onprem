import type { DesignNode } from '@root/types/document'
import type { InteractionOutcome } from '@root/types/preview'
import { getOutcomeTargets } from '@root/utils/flows/getOutcomeTargets'

export const getInitialInteractionOutcome = (
  nodes: DesignNode[],
  nodeId: string,
): InteractionOutcome => {
  const screens = getOutcomeTargets(nodes, nodeId, 'goTo')

  return screens.length
    ? { action: 'goTo', intent: 'formStep', targetNodeId: screens[0].value }
    : {
        action: 'openOverlay',
        targetNodeId: getOutcomeTargets(nodes, nodeId, 'openOverlay')[0]?.value ?? '',
      }
}
