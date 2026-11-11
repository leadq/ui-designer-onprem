import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { getConditionNodes } from '../conditionModel'

import { getStateFields } from './getStateFields'
import { getVisibilityRule } from './getVisibilityRule'

/** Offer fields from the selected screen; retain existing cross-screen bindings for editing old designs. */
export const getLocalStateFields = (
  nodes: DesignNode[],
  targets: DesignNode[],
  registry: Registry,
) => {
  const all = getConditionNodes(nodes)

  const screenIds = new Set(
    all.flatMap((node) => node.flow?.screens.map((screen) => screen.nodeId) ?? []),
  )

  const scopes = new Map<string, string | undefined>()

  const visit = (items: DesignNode[], scope?: string) =>
    items.forEach((node) => {
      const nextScope =
        node.overlay?.ownerFrameId ??
        (node.type === 'designerFrame' || screenIds.has(node.id) ? node.id : scope)

      scopes.set(node.id, nextScope)

      visit(node.children, nextScope)
    })

  visit(nodes)

  const existingIds = new Set(
    targets.flatMap((node) =>
      [getVisibilityRule(nodes, node), node.stateRules?.enabledWhen].flatMap(
        (rule) => rule?.conditions.map((condition) => condition.source.nodeId) ?? [],
      ),
    ),
  )

  return getStateFields(nodes, targets, registry).filter(
    (field) =>
      existingIds.has(field.id) ||
      targets.every((target) => scopes.get(target.id) === scopes.get(field.id)),
  )
}
