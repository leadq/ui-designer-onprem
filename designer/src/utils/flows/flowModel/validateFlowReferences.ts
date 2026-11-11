import type { DesignNode } from '@root/types/document'
import { getConditionNodes, getRuleBranches } from '@root/utils/conditions/conditionModel'

import { getAllNodes } from './getAllNodes'
import { getFlowOwner } from './getFlowOwner'

export const validateFlowReferences = (nodes: DesignNode[]): void => {
  const all = getAllNodes(nodes)

  if (new Set(all.map((node) => node.id)).size !== all.length) {
    throw new Error('Duplicate node IDs in flow document')
  }

  const ownedFrames = new Set<string>()

  for (const owner of all.filter((node) => node.flow)) {
    for (const screen of owner.flow!.screens) {
      const candidates = owner.flow!.layout === 'root' ? nodes : owner.children

      if (
        !candidates.some((node) => node.id === screen.nodeId && !node.flow) ||
        ownedFrames.has(screen.nodeId)
      ) {
        throw new Error('Invalid or shared frame ownership')
      }

      ownedFrames.add(screen.nodeId)
    }
  }

  for (const source of all) {
    if (source.overlay) {
      const flow = getFlowOwner(nodes, source.id)?.flow

      if (
        !flow?.screens.some((screen) => screen.nodeId === source.id && screen.kind === 'overlay') ||
        !flow.screens.some(
          (screen) => screen.nodeId === source.overlay?.ownerFrameId && screen.kind === 'screen',
        )
      ) {
        throw new Error('Invalid modal owner frame')
      }
    }

    const rules = source.interactions ?? []

    if (new Set(rules.map((rule) => rule.id)).size !== rules.length) {
      throw new Error('Duplicate interaction IDs')
    }

    for (const rule of rules.flatMap(getRuleBranches)) {
      const input = rule.condition?.source

      if (
        input?.kind === 'field' &&
        !getConditionNodes(nodes).some((node) => node.id === input.nodeId)
      ) {
        throw new Error('Invalid condition field reference')
      }

      if (['show', 'hide', 'toggle'].includes(rule.action)) {
        continue
      }

      const owner = getFlowOwner(nodes, rule.targetNodeId)
      const expectedKind = rule.action === 'goTo' ? 'screen' : 'overlay'

      if (
        !owner?.flow?.screens.some(
          (screen) => screen.nodeId === rule.targetNodeId && screen.kind === expectedKind,
        )
      ) {
        throw new Error('Invalid flow connection target')
      }
    }
  }
}
