import type { DesignNode } from '@root/types/document'
import { getAllNodes } from '@root/utils/flows/flowModel'

/** Boundary links are deliberately omitted; never import unrelated screens to satisfy a link. */
export const getPrunedReferences = (nodes: DesignNode[], ids: Set<string>) => {
  const interactions: { nodeId: string; interactionId: string; branch: 'rule' | 'otherwise' }[] = []
  const bindings: { nodeId: string; field: string }[] = []

  for (const node of getAllNodes(nodes)) {
    node.interactions = node.interactions?.filter((rule) => {
      if (
        !ids.has(rule.targetNodeId) ||
        (rule.condition?.source.kind === 'field' && !ids.has(rule.condition.source.nodeId))
      ) {
        interactions.push({ nodeId: node.id, interactionId: rule.id, branch: 'rule' })

        return false
      }

      if (rule.otherwise && !ids.has(rule.otherwise.targetNodeId)) {
        delete rule.otherwise

        interactions.push({ nodeId: node.id, interactionId: rule.id, branch: 'otherwise' })
      }

      return true
    })

    if (node.textBinding && !ids.has(node.textBinding.sourceNodeId)) {
      delete node.textBinding

      bindings.push({ nodeId: node.id, field: 'textBinding' })
    }

    for (const key of ['visibleWhen', 'enabledWhen'] as const) {
      if (
        node.stateRules?.[key]?.conditions.some((condition) => !ids.has(condition.source.nodeId))
      ) {
        delete node.stateRules[key]

        bindings.push({ nodeId: node.id, field: `stateRules.${key}` })
      }
    }

    if (node.toggleBinding) {
      const binding = node.toggleBinding
      const before = JSON.stringify(binding)

      if (binding.visibleNodeId && !ids.has(binding.visibleNodeId)) {
        delete binding.visibleNodeId
      }

      for (const key of ['visibleNodeIds', 'hiddenWhenCheckedNodeIds', 'exclusiveWith'] as const) {
        if (binding[key]) {
          binding[key] = binding[key]!.filter((id) => ids.has(id))
        }
      }

      if (before !== JSON.stringify(binding)) {
        bindings.push({ nodeId: node.id, field: 'toggleBinding' })
      }

      if (
        !binding.visibleNodeId &&
        !binding.visibleNodeIds?.length &&
        !binding.hiddenWhenCheckedNodeIds?.length &&
        !binding.exclusiveWith.length
      ) {
        delete node.toggleBinding
      }
    }
  }

  return { interactions, bindings }
}
