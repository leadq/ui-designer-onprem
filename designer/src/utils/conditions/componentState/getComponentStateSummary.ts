import type { DesignNode } from '@root/types/document'

import { getTogglePeers } from '../toggleBindings'

import { getVisibilityRule } from './getVisibilityRule'

/** Shared by the closed inspector and canvas badges, including imported legacy state. */
export const getComponentStateSummary = (nodes: DesignNode[], node: DesignNode) => {
  const conditionCount =
    (getVisibilityRule(nodes, node)?.conditions.length ?? 0) +
    (node.stateRules?.enabledWhen?.conditions.length ?? 0)

  const hasSettings = Boolean(
    conditionCount ||
    node.prototypeHidden ||
    node.props.disabled === true ||
    getTogglePeers(nodes, node.id).length,
  )

  return { conditionCount, hasSettings }
}
