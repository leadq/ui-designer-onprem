import type { PageState } from '@root/stores/editor/pageState'
import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { getFrameForNode, getFrameInsertionTarget } from '../frames/frameWorkspace'

import { getFlowOwner } from './flowModel'

export const getOverlayInsertion = (
  state: PageState,
  node: DesignNode,
  registry: Registry,
  targetId?: string,
): { node: DesignNode; flowId: string } | null => {
  const meta = registry[node.type]

  if (!meta?.overlay) {
    return null
  }

  const target = getFrameForNode(state.nodes, targetId ?? state.editingFlowScreenId ?? '')

  const frameId =
    target?.overlay?.ownerFrameId ?? target?.id ?? getFrameInsertionTarget(state.nodes, null)

  const owner = frameId ? getFlowOwner(state.nodes, frameId) : undefined
  const flow = owner?.flow

  if (!flow || !owner || !frameId) {
    return null
  }

  const count = flow.screens.filter((screen) => screen.kind === 'overlay').length

  return {
    flowId: owner.id,
    node: {
      ...node,
      label: `${meta.displayName}${count ? ` ${count + 1}` : ''}`,
      overlay: {
        ownerFrameId: frameId,
        kind: 'custom',
        presentation: meta.overlay.presentation,
        initiallyOpen: false,
        withBackdrop: meta.overlay.presentation === 'modal',
      },
    },
  }
}
