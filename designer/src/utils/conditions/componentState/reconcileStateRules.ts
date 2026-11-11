import type { DesignNode } from '@root/types/document'

import { getConditionNodes } from '../conditionModel'

/** Removing an input never silently weakens an all/any condition. Keep its target closed. */
export const reconcileStateRules = (nodes: DesignNode[]): void => {
  const all = getConditionNodes(nodes)
  const ids = new Set(all.map((node) => node.id))

  for (const node of all) {
    if (node.stateRules) {
      const descendants = new Set(getConditionNodes([node]).map((item) => item.id))

      for (const key of ['visibleWhen', 'enabledWhen'] as const) {
        const rule = node.stateRules[key]

        if (
          rule?.conditions.some(
            (condition) =>
              !ids.has(condition.source.nodeId) || descendants.has(condition.source.nodeId),
          )
        ) {
          delete node.stateRules[key]

          if (key === 'visibleWhen') {
            node.prototypeHidden = true
          } else {
            node.props.disabled = true
          }
        }
      }

      if (!Object.keys(node.stateRules).length) {
        delete node.stateRules
      }
    }
  }
}
