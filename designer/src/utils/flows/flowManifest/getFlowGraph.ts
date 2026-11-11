import type { DesignNode } from '@root/types/document'
import { getExampleKey, getRuleBranches } from '@root/utils/conditions/conditionModel'

import { getAllNodes, getContainingScreen, getInteractionEffects } from '../flowModel'

export const getFlowGraph = (nodes: DesignNode[]) => {
  const all = getAllNodes(nodes)

  const flows = all
    .filter((node) => node.flow)
    .map((node) => ({
      id: node.id,
      name: node.label ?? node.id,
      startScreenId: node.flow!.startScreenId,
      notes: node.notes ?? '',
      annotations: node.annotations ?? [],
      screens: node.flow!.screens.map((screen) => ({
        ...screen,
        name: all.find((item) => item.id === screen.nodeId)?.label ?? screen.nodeId,
      })),
    }))

  const states = flows.flatMap((flow) =>
    flow.screens.map((screen) => ({
      id: screen.nodeId,
      kind: screen.kind,
      scopeId: flow.id,
      name: screen.name,
      overlay: all.find((node) => node.id === screen.nodeId)?.overlay ?? null,
    })),
  )

  const connections = all.flatMap((node) =>
    (node.interactions ?? []).flatMap((interaction, order) =>
      getRuleBranches(interaction).map((rule) => {
        const sourceStateId = getContainingScreen(nodes, node.id)?.id ?? null

        return {
          ...rule,
          intent: rule.intent ?? null,
          sourceNodeId: node.id,
          sourceStateId,
          sourceScopeId: states.find((state) => state.id === sourceStateId)?.scopeId ?? null,
          targetScopeId: states.find((state) => state.id === rule.targetNodeId)?.scopeId ?? null,
          order,
          connectionKey: JSON.stringify([node.id, rule.interactionId, rule.branch]),
          effects: getInteractionEffects(nodes, rule),
          guard: rule.condition
            ? {
                condition: rule.condition,
                inputKey:
                  rule.condition.source.kind === 'field'
                    ? rule.condition.source.nodeId
                    : getExampleKey(node.id, rule.interactionId),
                expected: rule.branch === 'then',
                invalid: 'skip-both-branches' as const,
              }
            : null,
        }
      }),
    ),
  )

  // Fixed point supports windows opened by other windows, including cycles.
  const contexts = new Map(
    states.map((state) => [
      state.id,
      new Set(
        state.kind === 'screen' ? [state.id] : state.overlay ? [state.overlay.ownerFrameId] : [],
      ),
    ]),
  )

  let changed = true

  while (changed) {
    changed = false

    for (const rule of connections.filter((rule) => rule.action === 'openOverlay')) {
      const target = contexts.get(rule.targetNodeId)

      for (const id of contexts.get(rule.sourceStateId ?? '') ?? []) {
        if (target && !target.has(id)) {
          target.add(id)

          changed = true
        }
      }
    }
  }

  return { all, flows, states, connections, contexts }
}
